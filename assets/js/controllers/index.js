var app = angular.module('movieApp', ['ngSanitize']);

app.controller('movieController', function($scope, $http, $window, $document, $timeout, $sce) {
	const url = 'https://devadriano.com.br/lab/MDB/api/';
	var total_results = 1;
	var height;

	$scope.pages = 0;
	$scope.page = 1;
	$scope.query = '';
	$scope.loading = true;
	$scope.none = false;
	$scope.menu = 0;
	$scope.action = 'now_playing';
	$scope.movies = [];
	$scope.trailers = [];
	$scope.movie;

	$scope.onInit = () => {
		$scope.getMovies(1, $scope.action, $scope.query);
	};

	$scope.pressEnter = (event) => {
		if(event.which === 13 && $scope.query !== ''){
			$scope.getMovies(1, 'search', $scope.query);
		}
	}

	$scope.getMovies = (page, action, query = '') => {
		var data = {
			page: page,
			action: action,
			query: query
		};

		$scope.loading = true;
		$http.post(url, data).then((response) => {
			$scope.loading = false;
			if(response.data.data.results){
				if(response.data.data.results.length){
					$scope.movies = response.data.data.results;
					$scope.none = false;
				}
			}else{
				$scope.movies = [];
				$scope.none = true;
			}

			if(response.data.data.total_results){
				total_results = response.data.data.total_results;
				$scope.pages = Math.ceil(total_results / 20);
			}else{
				$scope.pages = 0;
			}
		});
	}

	$scope.setMenu = (index, action) => {
		$scope.menu = index;
		$scope.action = action;
		$scope.page = 1;
		UIkit.switcher('#main_content').show(index);
		UIkit.offcanvas('#offcanvas-menu').hide();

		if(index != 3){
			$scope.query = '';
			$scope.getMovies(1, action, $scope.query);
		}else{
			$scope.movies = [];
			$scope.pages = 0;
		}
	}

	$scope.details = (id) => {
		$http.post(url, { movie_id: id, action: 'details' }).then((response) => {
			$scope.movie = response.data.data;
		});

		$http.post(url, { movie_id: id, action: 'trailers' }).then((response) => {
			if(response.data.data.results){
				response.data.data.results.forEach((el) => {
					el.key = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+el.key);
				});
			}
			$scope.trailers = response.data.data.results;
		});
	}

	$scope.turnPage = (move) => {
		if(move === '+'){
			$scope.page++;
		}else{
			$scope.page--;
		}
		$scope.getMovies($scope.page, $scope.action, $scope.query);
	}
});