<?php

class ProjectsCest
{
    public function _before(ApiTester $I, \Codeception\Scenario $scenario)
    {
        $I->dropDatabase();
        $I->haveHttpHeader('Content-Type', 'application/json');
    }

    public function create(ApiTester $I)
    {
        $I->createAndLoginUser();
        $faker = $I->getFaker();
        $project = [
            'title' => $faker->streetName,
            'description' => $faker->text('150'),
        ];
        $I->sendPOST('api/v1/projects', $project);
        $project = json_decode($I->grabResponse());
        $I->assertProject('$.data', 201);
        $project_id = $project->data->_id;

        $I->setHeader('X-Application', $project_id);
        $I->sendPOST('api/v1/projects/consumers', ['description' => $faker->text('20'), 'scope' => ['decisions_make']]);
        $I->assertConsumers('$.data[*]', 201);

        $I->sendPOST('api/v1/projects/consumers',
            ['description' => $faker->text('20'), 'scope' => ['check', 'undefined_scope']]);
        $I->seeResponseCodeIs(422);
    }

    public function visibility(ApiTester $I)
    {
        $first_user = $I->createUser(true);
        $second_user = $I->createUser(true);

        $I->loginUser($first_user);
        $project = $I->createProjectAndSetHeader();

        $I->sendGET('api/v1/projects');

        $I->assertContains($project->_id, $I->grabResponse());
        $I->sendPOST('api/v1/projects/users',
            [
                'user_id' => $second_user->_id,
                'role' => 'manager',
                'scope' => ['tables_create', 'tables_update'],
            ]);
        $I->seeResponseCodeIs(422);
        
        $I->sendPOST('api/v1/projects/users',
            [
                'user_id' => $second_user->_id,
                'role' => 'manager',
                'scope' => ['tables_create', 'tables_view', 'tables_update'],
            ]
        );
        $I->seeResponseCodeIs(201);
        $I->loginUser($second_user);
        $I->sendGET('api/v1/projects');
        $I->assertContains($project->_id, $I->grabResponse());
    }

    public function update(ApiTester $I)
    {
        $I->createAndLoginUser();
        $I->createProjectAndSetHeader();
        $I->sendPUT('api/v1/projects', ['description' => 'Edited']);
        $I->assertProject();
        $I->seeResponseContains('"description":"Edited"');
    }


    public function export(ApiTester $I)
    {
        $I->createAndLoginUser();
        $I->createProjectAndSetHeader();
        $I->createTable();
        $I->sendGET('api/v1/projects/export');
        $I->seeResponseCodeIs(200);
        $I->seeResponseMatchesJsonType(['url' => 'string'], '$.data');
        $I->assertTrue(false !== file_get_contents($I->getResponseFields()->data->url));
    }
    
    public function delete(ApiTester $I)
    {
        $user = $I->createAndLoginUser();
        $I->createProjectAndSetHeader();
        $I->loginClient($I->getCurrentClient());
        $second_user = $I->createUser(true);
        $I->loginUser($user);
        $table = $I->createTable();
        $I->sendPOST('api/v1/projects/users',
            ['user_id' => $second_user->_id, 'role' => 'manager', 'scope' => ['tables_view', 'tables_update']]);
        $I->loginUser($second_user);
        $I->sendDELETE('api/v1/projects');
        $I->seeResponseCodeIs(403);
        $I->loginUser($user);
        $I->sendDELETE('api/v1/projects');
        $I->seeResponseCodeIs(200);
        $I->sendGET('api/v1/admin/tables' . $table->_id);
        $I->seeResponseCodeIs(404);
    }

    public function scope(ApiTester $I)
    {
        $user = $I->createAndLoginUser();
        $I->createProjectAndSetHeader();
        $I->loginClient($I->getCurrentClient());
        $second_user = $I->createUser(true);
        $I->loginUser($user);
        $I->sendPOST('api/v1/projects/users',
            ['user_id' => $second_user->_id, 'role' => 'manager', 'scope' => ['tables_view', 'tables_update']]);
        $I->loginUser($second_user);
        $I->sendPOST('api/v1/admin/tables', $I->getTableData());
        $I->seeResponseCodeIs(403);
        $I->seeResponseContains('"meta":{"error_message":"Bad Scopes","scopes":["tables_create"],"code":403,"error":"access_denied"}');
    }

    public function duplicateUserToTheProject(ApiTester $I)
    {
        $user = $I->createAndLoginUser();
        $I->createProjectAndSetHeader();
        $I->loginClient($I->getCurrentClient());
        $second_user = $I->createUser(true);
        $I->loginUser($user);
        $I->sendPOST('api/v1/projects/users',
            ['user_id' => $second_user->_id, 'role' => 'manager', 'scope' => ['tables_view', 'tables_update']]);
        $I->seeResponseCodeIs(201);
        $I->sendPOST('api/v1/projects/users',
            ['user_id' => $second_user->_id, 'role' => 'manager', 'scope' => ['tables_view', 'tables_update']]);
        $I->seeResponseCodeIs(400);
        $I->seeResponseContains('duplicate user');

        $I->sendPOST('api/v1/projects/users',
            ['user_id' => $user->_id, 'role' => 'manager', 'scope' => ['tables_view', 'tables_update']]);
        $I->seeResponseCodeIs(400);
        $I->seeResponseContains('duplicate user');
    }

    public function getConsumers(ApiTester $I)
    {
        $user = $I->createAndLoginUser();
        $I->createProjectAndSetHeader();
        $I->loginClient($I->getCurrentClient());
        $second_user = $I->createUser(true);
        $I->loginUser($user);
        $I->sendGET('api/v1/projects');
        $I->seeResponseCodeIs(200);
        $I->cantSeeResponseContains("\"consumers\":");
        $I->createConsumer();
        $I->createConsumer();
        $I->createConsumer();
        $I->sendGET('api/v1/projects/consumers');
        $I->assertConsumers();
        $I->sendPOST('api/v1/projects/users',
            ['user_id' => $second_user->_id, 'role' => 'manager', 'scope' => ['tables_view', 'tables_update']]);
        $I->loginUser($second_user);
        $I->sendGET('api/v1/projects/consumers');
        $I->seeResponseCodeIs(403);
        $I->loginUser($user);
        $I->sendPUT('api/v1/projects/users/',
            [
                'user_id' => $second_user->_id,
                'role' => 'manager',
                'scope' => ['tables_view', 'tables_update', 'consumers_get'],
            ]);
        $I->loginUser($second_user);
        $I->sendGET('api/v1/projects/consumers');
        $I->assertConsumers();
    }

    public function consumers(ApiTester $I)
    {
        $faker = $I->getFaker();
        $I->createAndLoginUser();
        $I->createProjectAndSetHeader();
        $I->createConsumer();
        $I->sendPOST('api/v1/projects/consumers',
            ['description' => $faker->text('20'), 'scope' => ['decisions_view', 'decisions_make']]);
        $consumer = json_decode($I->grabResponse())->data[0];
        $I->assertConsumers('$.data[*]', 201);

        $text = $faker->text('20');
        $I->sendPUT('api/v1/projects/consumers',
            [
                'description' => $text,
                'scope' => ['decisions_view', 'decisions_make'],
                'client_id' => $consumer->client_id,
            ]);
        $I->seeResponseContains($text);
        $I->assertConsumers();

        $I->sendDELETE('api/v1/projects/consumers', ['client_id' => $consumer->client_id]);
        $I->cantSeeResponseContains($consumer->client_id);
        $I->assertConsumers();
    }

    public function settings(ApiTester $I)
    {
        $I->createAndLoginUser();
        $I->createProjectAndSetHeader();

        $I->sendPUT('api/v1/projects', ['settings' => []]);
        $I->assertProject();
        $I->assertTrue(($I->getResponseFields()->data->settings instanceof \StdClass));
    }

    public function getCurrentUserScope(ApiTester $I)
    {
        $user = $I->createAndLoginUser();
        $I->createProjectAndSetHeader();
        $I->loginClient($I->getCurrentClient());
        $second_user = $I->createUser(true);
        $I->loginUser($user);
        $I->sendPOST('api/v1/projects/users',
            ['user_id' => $second_user->_id, 'role' => 'manager', 'scope' => ['tables_view', 'tables_update']]);
        $I->loginUser($second_user);
        $I->sendGET('api/v1/projects/users');
        $I->assertProjectUser();
    }
}
