'use strict';

angular.module('app').service('ProjectsService', function (Project, $gandalf, $timeout, $rootScope, $localStorage, $q, lodash, $cacheFactory, utils) {

  var appCache = $cacheFactory('projects');
  var storage = $localStorage.$default({
    project: null
  });
  var initialized = false;

  $rootScope.$on('userDidLogout', function () {
    storage.project = null;
    initialized = false;
    $gandalf.setProjectId(null);
    appCache.remove('projects');
  });

  // collection

  this.all = all;
  this.update = update;
  this.selectProject = selectProject;
  this.selectedProject = function () {
    return new Project(storage.project);
  };
  this.setProject = setProject;
  this.clearProject = clearProject;

  this.current = current;

  // functions

  function all() {
    return appCache.get('projects') || update();
  }

  function current () {
    return $gandalf.admin.getCurrentProject().then(function (response) {
      var project = new Project(response.data);
      selectProject(project);
      return project;
    });
  }
  function update() {
    return Project.find().then(function (projectsResp) {
      init(projectsResp);
      appCache.put('projects', projectsResp);
      $rootScope.$broadcast('projectsDidUpdate', projectsResp);

      return projectsResp;
    });
  }

  function setProject(project) {
    if (!project || (lodash.get(storage, 'project._id') == project.id && initialized)) return;
    $gandalf.setProjectId(project.id);
    storage.project = project.toJSON();
    return storage.project;
  }

  function selectProject(project) {
    if (!project || (lodash.get(storage, 'project._id') == project.id && initialized)) return;
    $gandalf.setProjectId(project.id);
    storage.project = project.toJSON();

    $rootScope.$broadcast('projectDidSelect', project);
    if (initialized) utils.reload();
  }

  function clearProject(project) {
    storage.project = null;
    $gandalf.setProjectId(null);
    $rootScope.$broadcast('projectDidSelect', project);
  }

  function init(projects) {
    var storageProject = new Project(storage.project);
    var currentProject = (storageProject ? lodash.find(projects, {
        id: storageProject.id
      }) : null) || projects[0];

    selectProject(currentProject);
    initialized = true;
  }



  function initFromStorage() {
    var storageProject = new Project(storage.project);
    if (storageProject.id) {
      $gandalf.setProjectId(storageProject.id);
      return storageProject.id;
    }
    return null;
  }

  initFromStorage();


});
