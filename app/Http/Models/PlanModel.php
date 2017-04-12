<?
namespace App\Http\Models;
use DB;
use Illuminate\Database\Eloquent\Model;

class PlanModel extends Model {
	public function getAllPlan() {
		$ret['data']    = DB::connection('db_plan')->table('t_plan')->where("stat", 1)->get();
		$ret['totalTm'] = DB::connection('db_plan')->table('t_plan')->where("stat", 1)->sum('costtime');
		return $ret;
	}
}