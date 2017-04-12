<?php
namespace App\Http\Controllers\Plan;

use App\Http\Controllers\Controller;
use App\Http\Models\Plan;
use Config;
use Helper\Library;
use Illuminate\Http\Request;

class JsonController extends Controller
{
    public function edit(Request $request)
    {
        $name         = $request->input('name');
        $id           = intval($request->input('id'));
        $admincpModel = new Plan();
        switch ($name) {
            case 'vrhelp_video':
                if ($id > 0) {
                    $data = $admincpModel->getOneData($name, $id);
                } else {
                    $data = ['video_id' => 0, 'video_name' => '', 'video_class' => '', 'video_intro' => '', 'video_copyright' => 1, 'video_link_tp' => 1, 'video_cover' => '', 'video_link' => '', 'video_uid' => $user['wwwUid']];
                }
                $out = [
                    'video_id'        => ['tp' => 'input', 'val' => $data["video_id"], 'ck' => 'num'],
                    'video_name'      => ['tp' => 'input', 'val' => $data["video_name"], 'ck' => 'length'],
                    'video_class'     => ['tp' => 'muti_select', 'val' => $data["video_class"], 'ck' => 'length'],
                    'video_intro'     => ['tp' => 'textarea', 'val' => $data["video_intro"], 'ck' => 'length'],
                    'video_copyright' => ['tp' => 'radio', 'val' => $data["video_copyright"], 'ck' => 'val'],
                    'video_link_tp'   => ['tp' => 'radio', 'val' => $data["video_link_tp"], 'ck' => 'val'],
                    'video_cover'     => ['tp' => 'img_input', 'val' => $data["video_cover"], 'ck' => 'length'],
                    'video_link'      => ['tp' => 'input', 'val' => $data["video_link"], 'ck' => 'length'],
                    'wwwUid'          => $data["video_uid"],
                ];
                break;
            case 'vronline_game':
                if ($id > 0) {
                    // $ret = $admincpModel->getOneData($name, $id);

                    // $data = ['game_id' => $ret['game_id'], 'game_name' => $ret['game_name'], 'game_alias' => $ret['game_alias'], 'game_keywords' => $ret['game_keywords'], 'game_category' => $ret['game_category'], 'game_tags' => $ret['game_tags'], 'game_sell_date' => date('Y-m-d H:i:s', $ret['game_sell_date']), 'game_price' => $ret['game_price'], 'game_device' => $ret['game_device'], 'game_platform' => $ret['game_platform'], 'game_lang' => $ret['game_lang'], 'game_theme' => $ret['game_theme'], 'game_developer' => $ret['game_company'], 'game_operator' => $ret['game_operator'], 'game_website' => $ret['game_offical_url'], 'game_address' => $ret['game_buy_url'], 'game_download' => $ret['game_down_url'], 'game_desc' => $ret['game_desc'], 'game_search_name' => $ret['game_search_name'], 'game_image' => $ret['game_image']];
                    $data = ['game_id' => 0, 'game_name' => '', 'game_alias' => '', 'game_keywords' => '', 'game_category' => '', 'game_tags' => '', 'game_sell_date' => '2017-04-05 12:00:00', 'game_price' => '', 'game_device' => '', 'game_platform' => '', 'game_lang' => '', 'game_theme' => '', 'game_developer' => '', 'game_operator' => '', 'game_website' => '', 'game_address' => '', 'game_download' => '', 'game_desc' => '', 'game_search_name' => '', 'game_image' => ''];
                } else {
                    $data = ['game_id' => 0, 'game_name' => '', 'game_alias' => '', 'game_keywords' => '', 'game_category' => '', 'game_tags' => '', 'game_sell_date' => '2017-04-05 12:00:00', 'game_price' => '', 'game_device' => '', 'game_platform' => '', 'game_lang' => '', 'game_theme' => '', 'game_developer' => '', 'game_operator' => '', 'game_website' => '', 'game_address' => '', 'game_download' => '', 'game_desc' => '', 'game_search_name' => '', 'game_image' => ''];
                }
                $out = [
                    'game_id'          => ['tp' => 'input', 'val' => $data["game_id"], 'ck' => 'num'],
                    'game_name'        => ['tp' => 'input', 'val' => $data["game_name"], 'ck' => 'length'],
                    'game_alias'       => ['tp' => 'input', 'val' => $data["game_alias"], 'ck' => 'length'],
                    'game_keywords'    => ['tp' => 'input', 'val' => $data["game_keywords"], 'ck' => 'length'],
                    'game_category'    => ['tp' => 'muti_select', 'val' => $data["game_category"], 'ck' => 'length'],
                    'game_tags'        => ['tp' => 'muti_select', 'val' => $data["game_tags"], 'ck' => 'length'],
                    'game_sell_date'   => ['tp' => 'input', 'val' => $data["game_sell_date"], 'ck' => 'length'],
                    'game_price'       => ['tp' => 'input', 'val' => $data["game_price"], 'ck' => 'length'],
                    'game_device'      => ['tp' => 'muti_select', 'val' => $data["game_device"], 'ck' => 'length'],
                    'game_platform'    => ['tp' => 'muti_select', 'val' => $data["game_platform"], 'ck' => 'length'],
                    'game_lang'        => ['tp' => 'muti_select', 'val' => $data["game_lang"], 'ck' => 'length'],
                    'game_theme'       => ['tp' => 'input', 'val' => $data["game_theme"], 'ck' => 'length'],
                    'game_developer'   => ['tp' => 'input', 'val' => $data["game_developer"], 'ck' => 'length'],
                    'game_operator'    => ['tp' => 'input', 'val' => $data["game_operator"], 'ck' => 'length'],
                    'game_website'     => ['tp' => 'input', 'val' => $data["game_website"], 'ck' => 'length'],
                    'game_address'     => ['tp' => 'input', 'val' => $data["game_address"], 'ck' => 'no'],
                    'game_download'    => ['tp' => 'input', 'val' => $data["game_download"], 'ck' => 'length'],
                    'game_desc'        => ['tp' => 'textarea', 'val' => $data["game_desc"], 'ck' => 'length'],
                    'game_search_name' => ['tp' => 'input', 'val' => $data["game_search_name"], 'ck' => 'length'],
                    'top_cover'        => ['tp' => 'img_input', 'val' => $data["game_image"], 'ck' => 'no'],
                ];
                break;
            default:
                # code...
                break;
        }
        return json_encode($out);
    }

    public function save(Request $request, $name)
    {
        switch ($name) {
            case 'vrhelp_video':
                $data = $request->all();
                $info = $this->parseData($data);
                $id   = $info['video_id'];
                unset($info['video_id']);
                $videoModel         = new Plan();
                $info['video_stat'] = 1;
                $ret                = $videoModel->saveDevVideoInfo($id, $info);
                break;
            case "vronline_game":
                $data         = $request->all();
                $info         = $this->parseData($data);
                $id           = intval($info['game_id']);
                $gameCategory = '';
                $arr          = ['game_name' => $info['game_name'], 'game_vrhelp_id' => 1, 'game_alias' => $info['game_alias'], 'game_keywords' => $info['game_keywords'], 'game_category' => $info['game_category'], 'game_tags' => $info['game_tags'], 'game_sell_date' => strtotime($info['game_sell_date']), 'game_price' => $info['game_price'], 'game_device' => $info['game_device'], 'game_platform' => $info['game_platform'], 'game_lang' => $info['game_lang'], 'game_theme' => $info['game_theme'], 'game_company' => $info['game_developer'], 'game_operator' => $info['game_operator'], 'game_offical_url' => $info['game_website'], 'game_buy_url' => $info['game_address'], 'game_down_url' => $info['game_download'], 'game_desc' => $info['game_desc'], 'game_search_name' => $info['game_search_name'], 'game_image' => $info['top_cover']];

                $vronlineModel = new Plan();
                $ret           = $vronlineModel->saveGameInfo($id, $arr);
                if ($ret) {
                    return Library::output(0);
                }
                return Library::output(1, $arr);
                break;
        }
        return Library::output(0);
    }

    public function pass(Request $request, $name)
    {
        switch ($name) {
            case 'vrhelp_video':
                $id  = $request->input('edit_id');
                $tp  = intval($request->input('tp'));
                $msg = $request->input('msg');

                $videoModel = new Plan();
                $video      = $videoModel->getDevVideoById($id);
                if (isset($video['video_name']) && $video['video_name']) {
                    $pinyin = new Pinyin();
                    $spell  = strtolower($pinyin->sentence($video['video_name']));
                    $spell  = substr($spell, 0, 1);
                    if (is_numeric($spell)) {
                        $spell = Library::num2Pinyin($spell);
                        $spell = substr($spell, 0, 1);
                    }
                    $setinfo                = array();
                    $setinfo['video_spell'] = $spell;
                    $videoModel->saveDevVideoInfo($id, $setinfo);
                }
                if ($tp == 1) {
                    $ret = $videoModel->passDevVideoInfo($id);
                } else {
                    $info                 = array();
                    $info['video_stat']   = 3;
                    $info['video_review'] = $msg;
                    $ret                  = $videoModel->saveDevVideoInfo($id, $info);
                }
                break;
        }
        return Library::output(0);
    }

    public function del(Request $request, $name)
    {
        $id = intval($request->input('del_id'));
        switch ($name) {

            case 'vrhelp_video':
                $videoModel = new Plan();
                $ret        = $videoModel->offlineDevVideoInfo($id);

                break;
            case 'sys_user':
                $admincpModel = new Plan();
                $ret          = $admincpModel->delSysUser($id);
                break;
        }
        return Library::output(0);
    }

    private function parseData($data)
    {
        foreach ($data as $key => $value) {
            if (strstr($key, "json")) {
                unset($data[$key]);
            }
        }
        return $data;
    }
}
