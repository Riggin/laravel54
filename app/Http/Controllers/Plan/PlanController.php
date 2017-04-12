<?php
namespace App\Http\Controllers\Plan;

use App\Http\Controllers\Controller;
use App\Http\Models\Plan;
use Helper\HttpRequest;
use Helper\Library;
use Illuminate\Http\Request;

class PlanController extends Controller
{

    public function getPlan(Request $request)
    {
        Library::accessHeader();
        $planModel      = new Plan();
        $ret            = $planModel->getAllPlan();
        $ret['data']    = $this->getPlanFormat(json_decode($ret['data'], 1));
        $ret['totalTm'] = $ret['totalTm'];
        return Library::outPutArr(0, $ret);
    }

    public function addPlan(Request $request)
    {
        Library::accessHeader();
        $planModel = new Plan();
        $req       = $request->input('params');
        $ret       = $planModel->addPlan($req);
        return Library::outPutArr(0);
    }

    public function delPlan(Request $request)
    {
        Library::accessHeader();
        $planModel = new Plan();
        $req       = $request->input('params');
        if (!isset($req['id']) || !$req['id']) {
            return Library::outPutArr(1);
        }
        $ret = $planModel->delPlan($req['id']);
        return Library::outPutArr(0);
    }

    public function getTulingRobot(Request $request)
    {
        $str = $request->input('str');

        $url         = "http://www.tuling123.com/openapi/api";
        $post_string = [
            'key'  => '47ee7b930873402ea7236277bcea7688',
            'info' => $str,
        ];
        // print_r($post_string);die;
        $ret = HttpRequest::post($url, $post_string);
        // return http()->post('http://www.tuling123.com/openapi/api', [
        //     'key'  => '1dce02aef026258eff69635a06b0ab7d',
        //     'info' => $str,
        // ], true)['text'];
        return $ret;
    }

    public function index(Request $request)
    {
        $search     = $request->input("search");
        $searchText = $search ? $search : '';
        // $vronlineModel = new Plan();
        // $data          = $vronlineModel->getGamesList($searchText);
        $data = [
            ['game_id' => 1, 'game_name' => '1', 'game_alias' => '1', 'game_keywords' => '1', 'game_category' => '10100', 'game_tags' => '1', 'game_sell_date' => '2017-04-05 12:00:00', 'game_price' => '1', 'game_device' => '1', 'game_platform' => '2', 'game_lang' => '2', 'game_theme' => '4', 'game_developer' => '22', 'game_operator' => '33', 'game_website' => '44', 'game_address' => '55', 'game_download' => '66', 'game_desc' => '77', 'game_search_name' => '88', 'game_image' => 'bannerimg/8e15128333f9bb1574e95612ba7bb4691491442774665.jpg'],
            ['game_id' => 2, 'game_name' => '1', 'game_alias' => '1', 'game_keywords' => '1', 'game_category' => '10100', 'game_tags' => '1', 'game_sell_date' => '2017-04-05 12:00:00', 'game_price' => '1', 'game_device' => '1', 'game_platform' => '2', 'game_lang' => '2', 'game_theme' => '4', 'game_developer' => '22', 'game_operator' => '33', 'game_website' => '44', 'game_address' => '55', 'game_download' => '66', 'game_desc' => '77', 'game_search_name' => '88', 'game_image' => 'bannerimg/8e15128333f9bb1574e95612ba7bb4691491442774665.jpg'],
        ];

        return view('admin.index', ['cur' => 'vronline', 'path' => 'game', 'data' => $data, 'searchText' => $searchText]);

    }
    public static function getPlanFormat($array = [])
    {
        if (!is_array($array) || count($array) < 1) {
            return [];
        }
        $ret = [];
        foreach ($array as $k => $v) {
            $ret[$k]['id']       = $v['id'];
            $ret[$k]['name']     = $v['name'];
            $ret[$k]['title']    = $v['title'];
            $ret[$k]['content']  = $v['content'];
            $ret[$k]['avatar']   = "http://tva4.sinaimg.cn/crop.0.0.512.512.50/69917555jw8eq6ux7fycrj20e80e8gma.jpg";
            $ret[$k]['costTime'] = $v['costtime'];
            $ret[$k]['date']     = date('Y-m-d', strtotime($v['ctime']));
        }
        return $ret;
    }
}
