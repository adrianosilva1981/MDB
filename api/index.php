<?php
header("Access-Control-Allow-Origin: *");
header("Content-type: application/json");

require 'config/config.php';
require 'classes/curl_mdb.class.php';

$postdata = file_get_contents("php://input");
$request  = json_decode($postdata);
$action   = $request->action;
$page     = $request->page;
$query    = $request->query;
$page     = (int)$page > 0 ? (int)$page : 1;

$curl_mdb = new curl_mdb();

switch ($action) {
	//=========================================================================
	case 'now_playing':
		$url = URL_MOVIE_DATABASE.'movie/now_playing?api_key='.API_KEY.'&language=pt-BR&page='.$page;
		$response['data'] = $curl_mdb->exec_curl($url);
		break;
	//=========================================================================
	case 'popular':
		$url = URL_MOVIE_DATABASE.'movie/popular?api_key='.API_KEY.'&language=pt-BR&page='.$page;
		$response['data'] = $curl_mdb->exec_curl($url);
		break;
	//=========================================================================
	case 'top_rated':
		$url = URL_MOVIE_DATABASE.'movie/top_rated?api_key='.API_KEY.'&language=pt-BR&page='.$page;
		$response['data'] = $curl_mdb->exec_curl($url);
		break;
	//=========================================================================
	case 'search':
		$query = urlencode($query);
		$url = URL_MOVIE_DATABASE.'search/movie?api_key='.API_KEY.'&query='.$query.'&language=pt-BR&page='.$page.'&include_adult=false';
		$response['data'] = $curl_mdb->exec_curl($url);
		break;
	//=========================================================================
	case 'details':
		$movie_id = (int)$request->movie_id;
		$url = URL_MOVIE_DATABASE.'movie/'.$movie_id.'?api_key='.API_KEY.'&language=pt-BR';
		$response['data'] = $curl_mdb->exec_curl($url);
		break;
	//=========================================================================
	case 'trailers':
		$movie_id = (int)$request->movie_id;
		$url = URL_MOVIE_DATABASE.'movie/'.$movie_id.'/videos?api_key='.API_KEY.'&language=pt-BR';
		$response['data'] = $curl_mdb->exec_curl($url);
		break;
	//=========================================================================
	default:
		$response['success'] = true;
		$response['message'] = 'Nothing to do.';
		$response['data'] = array();
		break;
}

echo json_encode($response);