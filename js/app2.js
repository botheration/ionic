angular.module('todo', ['ionic'])

.factory('Projects',function(){
	return {
		all: function(){
			var projectString = window.localStorage['projects'];
			if(projectString) {
		        return angular.fromJson(projectString);
		    }
			return [];
		},
		save: function(projects) {
			//Storage {projects: "[{"title":"得分","tasks":[]}]", length: 1}
	      window.localStorage['projects'] = angular.toJson(projects);//把对象转化成字符串
	    },
	    newProject: function(projectTitle) {
	      // Add a new project
	      return {
	        title: projectTitle,
	        tasks: []
	      };
	    },
	    getLastActiveIndex: function() {
	      return parseInt(window.localStorage['lastActiveProject']) || 0;
	    },
	    setLastActiveIndex: function(index) {
	      window.localStorage['lastActiveProject'] = index;
	    }
	}
})

.controller('todoctrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {
	
	
	
	
	//加载或者初始化
	$scope.projects = Projects.all();//首次返回一个空数组[]
	//最后选中的项目或者第一次初始化的项目
  	$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
	
	$timeout(function() {
   		if($scope.projects.length == 0){
   			while(true){
   				var projectTitle = prompt('请输入第一个项目标题');
   				if(projectTitle){
   					createProject(projectTitle);
   					break;
   				}
   			}
   		}
  	});
  	
  	//创建项目及初始化
  	function createProject(projectTitle){
  		var newProject = Projects.newProject(projectTitle);
  		$scope.projects.push(newProject);
  		Projects.save($scope.projects);
  		$scope.selectProject(newProject, $scope.projects.length-1);
  	}
  	
  	
  	//创建新项目
  	$scope.newProject = function(){
  		var projectTitle = prompt('项目名称');
  		if(projectTitle){
  			createProject(projectTitle);
  		}
  	}
  	
  	//调用选择给定的项目
  	$scope.selectProject = function(project, index) {
	    $scope.activeProject = project;
	    Projects.setLastActiveIndex(index);
	    $ionicSideMenuDelegate.toggleLeft(false);
	  };
  	
	//调用模型
	$ionicModal.fromTemplateUrl('new-task.html', function(modal) {
	    $scope.taskModal = modal;
	  }, {
	    scope: $scope
	  });
	
	  $scope.createTask = function(task) {
	    if(!$scope.activeProject || !task) {
	      return;
	    }
	    $scope.activeProject.tasks.push({
	      title: task.title
	    });
	    $scope.taskModal.hide();
	
	    Projects.save($scope.projects);
	
	    task.title = "";
	  };
	
	  $scope.newTask = function() {
	    $scope.taskModal.show();
	  };
	
	  $scope.closeNewTask = function() {
	    $scope.taskModal.hide();
	  }
	
	  $scope.toggleProjects = function() {
	    $ionicSideMenuDelegate.toggleLeft();
	  };

});
