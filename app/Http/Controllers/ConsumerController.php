<?php
/**
 * Author: Paul Bardack paul.bardack@gmail.com http://paulbardack.com
 * Date: 15.02.16
 * Time: 16:49
 */

namespace App\Http\Controllers;

use App\Exceptions\AdminIsNotActivatedException;
use App\Models\Decision;
use App\Models\User;
use App\Services\Scoring;
use Nebo15\LumenApplicationable\ApplicationableHelper;
use Nebo15\LumenApplicationable\Models\Application;
use Nebo15\REST\Response;
use Illuminate\Http\Request;
use App\Repositories\DecisionsRepository;
use Nebo15\REST\Traits\ValidatesRequestsTrait;

class ConsumerController extends Controller
{
    use ValidatesRequestsTrait;

    private $response;
    private $decisionsRepository;

    public function __construct(Response $response, DecisionsRepository $decisionsRepository)
    {
        $this->response = $response;
        $this->decisionsRepository = $decisionsRepository;
    }

    public function tableCheck(Request $request, Scoring $scoring, Application $application, $id)
    {
        $users = $application->users()->where('role', 'admin')->all();
        if (!$users) {
            throw new AdminIsNotActivatedException;
        }
        $userIds = [];
        foreach ($users as $user) {
            $userIds[] = strval($user['user_id']);
        }
        $users = User::whereIn('_id', $userIds)->where('active', true);
        if ($users->count() == 0) {
            throw new AdminIsNotActivatedException;
        }

        return $this->response->json(
            $scoring->check($id, $request->all(), $application->_id, $application->getSettingsElem('show_meta', false))
        );
    }

    public function decisions(Request $request)
    {
        return $this->response->jsonPaginator(
            $this->decisionsRepository->readList($request->input('size')),
            [],
            function (Decision $decision) {
                return $decision->toConsumerArray();
            }
        );
    }

    public function decision($id)
    {
        return $this->response->json($this->decisionsRepository->getConsumerDecision($id));
    }
}
