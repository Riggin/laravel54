<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

Route::get('/', 'Plan\PlanController@index');

Route::Any('/getallplan', 'Plan\PlanController@getPlan');
Route::Any('/getreplay', 'Plan\PlanController@getTulingRobot');
Route::post('/addplan', 'Plan\PlanController@addPlan');
Route::post('/delplan', 'Plan\PlanController@delPlan');

Route::post('/json/edit', 'Plan\JsonController@edit');
Route::post('/json/save/{name}', 'Plan\JsonController@save');
Route::post('/json/del/{name}', 'Plan\JsonController@del');
Route::post('/json/pass/{name}', 'Plan\JsonController@pass');
