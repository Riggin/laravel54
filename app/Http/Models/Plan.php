<?php

namespace App\Http\Models;
use DB;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model {
	/**
	 * 获取所有未完成的plan
	 * [getAllPlan description]
	 * @return [type] [description]
	 */
	public function getAllPlan() {
		$ret['data']    = DB::connection('db_plan')->table('t_plan')->where("stat", 1)->get();
		$ret['totalTm'] = DB::connection('db_plan')->table('t_plan')->where("stat", 1)->sum('costtime');
		return $ret;
	}
	/**
	 * 添加计划数据
	 * [addPlan description]
	 * @param array $arr [description]
	 */
	public function addPlan($arr = []) {
		$ret = DB::connection('db_plan')->table('t_plan')->where("stat", 1)->insert($arr);
		return $ret;
	}

	public function delPlan($id) {
		$data = [
			'stat' => 0
		];
		$ret = DB::connection('db_plan')->table('t_plan')->where("id", $id)->update($data);
		return $ret;
	}
}
