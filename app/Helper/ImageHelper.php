<?php

namespace App\Helper;

use App\Helper\Vredis;
use Config;
use Helper\HttpRequest;
use Helper\Library;

class ImageHelper
{

    public static function upload($tp, $id, $version = 0, $isdev = true)
    {
        $id = intval($id);
        if (!$id) {
            return false;
        }
        $cfg           = Config::get('server.img.' . $tp);
        $res           = [];
        $res['bucket'] = $cfg['bucket'];
        if ($isdev) {
            $res['remote'] = $cfg['dev'] . $id . "/";
        } else {
            $res['remote'] = $cfg['pub'] . $id . "/";
        }
        if ($tp == "video") {
            $res['remote'] = $cfg['dev'];
        } elseif ($tp == "bannerimg") {
            $res['remote'] = $cfg['dev'];
        } elseif ($tp == "openuser") {
            $res['fileName'] = "idcard";
            $res['url']      = $cfg['url'] . 'dev/' . $id . "/";
            $res['devpath']  = $cfg['dev'] . $id . "/";
            $res['pubpath']  = $cfg['pub'] . $id . "/";
        } elseif ($tp == "openapp") {
            $res['url']     = $cfg['url'] . 'dev/' . $id . "/";
            $res['devpath'] = $cfg['dev'] . $id . "/";
            $res['pubpath'] = $cfg['pub'] . $id . "/";
        } elseif ($tp == "userimg") {
            $res['fileName'] = $id;
        } elseif ($tp == "tob_idcard" || $tp == "tob_license") {
            $res['fileName'] = $tp;
            $res['url']      = $cfg['url'] . 'dev/' . $id . "/";
            $res['devpath']  = $cfg['dev'] . $id . "/";
            $res['pubpath']  = $cfg['pub'] . $id . "/";
        }
        $res['expired'] = time() + 60;

        return $res;
    }

    /**
     * @param   string  type    path:返回路径：url:返回链接
     */
    public static function url($tp, $id, $version = 1, $img_slider = "", $isdev = true, $img_screenshots = "", $type = "path")
    {
        $id = intval($id);
        if (!$id) {
            return false;
        }
        $cfg = Config::get('server.img.' . $tp);
        switch ($tp) {
            case 'userimg':
                $res['face'] = $cfg['url'] . $cfg['dev'] . $id . "/120.png";
                break;
            case 'vrgame':
            case 'webgame':
                if ($isdev) {
                    $base = $cfg['dev'] . $id;
                } else {
                    $base = $cfg['pub'] . $id;
                }
                if ($type == "url") {
                    $base = $cfg['url'] . $base;
                }
                $res['logo']  = $base . "/logo?{$version}";
                $res['slogo'] = $base . "/slogo?{$version}";
                $res['rank']  = $base . "/rank?{$version}";
                $res['icon']  = $base . "/icon?{$version}";
                $res['bg']    = $base . "/bg?{$version}";
                if ($tp == 'webgame') {
                    $res['ico']  = $base . "/ico?{$version}";
                    $res['bg2']  = $base . "/bg2?{$version}";
                    $res['card'] = $base . "/card?{$version}";
                }
                if (strlen($img_slider) > 2) {
                    $slider = json_decode($img_slider, true);
                    foreach ($slider as $value) {
                        $res['slider'][] = $base . '/' . $value;
                    }
                }
                if (strlen($img_screenshots) > 2) {
                    $screenshots = json_decode($img_screenshots, true);
                    if (!empty($screenshots)) {
                        foreach ($screenshots as $value) {
                            $res['screenshots'][] = $base . '/' . $value;
                        }
                    } else {
                        $res['screenshots'] = [];
                    }
                } else {
                    $res['screenshots'] = [];
                }
                break;
            case "tob_idcard":
            case "tob_license":
                $res['dir']    = '../upload/tob/dev/' . $id . '/';
                $res['pubdir'] = '../upload/tob/pub/' . $id . '/';
                break;
            default:
                # code...
                break;
        }

        return $res;
    }

    /**
     * 上传到线上的图片信息
     * @param   string   tp   图片类型 webgameimg vrgameimg  openuser openapp video
     * @param   int     appid   appid
     * @param   int     version 图片版本号，如果版本号是0，没传过图片
     * @param   bool    isdev   是否查看开发者后台的图片
     * @return  array   所有图片列表
     */
    public static function path($tp, $id, $version = 1, $img_slider = "", $isdev = true)
    {

        $id = intval($id);
        if (!$id) {
            return false;
        }

        if (!$version) {
            return array();
        }
        $cfg = Config::get('server.img.' . $tp);

        $path = $cfg['url'];

        if ($isdev) {
            $path .= "dev/";
        } else {
            $path .= "pub/";
        }
        $path .= $id . "/";
        $res = array();
        switch ($tp) {
            case 'webgameimg':
                $res['logo']    = $path . "logo?{$version}";
                $res['slogo']   = $path . "slogo?{$version}";
                $res['bg']      = $path . "bg?{$version}";
                $res['history'] = $path . "history?{$version}";
                $res['bg2']     = $path . "bg2?{$version}";
                $res['card']    = $path . "card?{$version}";
                $res['icon']    = $path . "icon?{$version}";
                $res['ico']     = $path . "ico?{$version}";
                break;
            case 'vrgameimg':
                $res['logo'] = $path . "logo?{$version}";
                $res['icon'] = $path . "icon?{$version}";
                $res['bg']   = $path . "bg?{$version}";
                break;
            case 'openapp':
                $res['dir']    = '../upload/app/dev/' . $id . '/';
                $res['pubdir'] = '../upload/app/pub/' . $id . '/';
                break;
            case 'openuser':
                $res['dir']         = '../upload/user/dev/' . $id . '/';
                $res['pubdir']      = '../upload/user/pub/' . $id . '/';
                $res['credentials'] = $path . "idcard?{$version}";
                break;
            case 'userimg':
                $res['remote'] = '/userimg/dev/' . $id . '/120.png';
                $res['face']   = $path . "120.png";
                $res['dir']    = '../upload/www/' . substr(md5($id), 0, 6) . "/";
                $res['bucket'] = $cfg['bucket'];
                break;
            case 'tob':
                $res['dir'] = '../upload/tob/dev/' . $id . "/";
                break;
            case 'service':
                $hashId      = md5($id);
                $res['dir']  = '../upload/service/' . substr($hashId, 0, 4) . "/" . substr($hashId, 4, 4) . "/";
                $path        = $cfg['url'] . substr($hashId, 0, 4) . "/" . substr($hashId, 4, 4) . "/";
                $res['ext']  = ['image/png' => 'png', 'image/jpeg' => 'jpg', 'image/gif' => 'gif'];
                $res['size'] = 2 * 1024 * 1024;
                break;
            case 'wwwimg':
                $res['remote'] = 'wwwimg-';
                $res['bucket'] = $cfg['bucket'];
                break;
            case 'video':
                $res['remote'] = '/dev/';
                $res['bucket'] = $cfg['bucket'];
                break;
            default:
                break;
        }
        if (strlen($img_slider) > 2) {
            $slider = json_decode($img_slider, true);
            foreach ($slider as $value) {
                $res['slider'][] = $path . $value;
            }
        }
        if ($isdev == false) {
            $res['dev_path'] = $cfg['bucket'] . '/' . $tp . '/dev/' . $id . '/';
            $res['pub_path'] = $cfg['bucket'] . '/' . $tp . '/pub/' . $id . '/';
            $res['bucket']   = $cfg['bucket'];
        }
        $res['base'] = $path;
        return $res;
    }

    public static function uploadDataUrl($tp, $urls, $id)
    {
        $resInfo   = self::path($tp, $id);
        $uploadDir = $resInfo['dir'];
        if (!file_exists($uploadDir)) {
            self::mkdirs($uploadDir);
        }

        $out = [];
        foreach ($urls as $key => $url) {
            if (!preg_match('/data:([^;]*);base64,(.*)/', $url, $matches)) {
                continue;
            }
            $fileType = $matches[1];
            $fileBlob = base64_decode($matches[2]);

            if (!in_array($fileType, array_keys($resInfo['ext']))) {
                continue;
            }

            if (!isset($resInfo['ext'][$fileType])) {
                continue;
            }

            if (!$fileBlob) {
                continue;
            }

            $fileName = self::randName() . '.' . $resInfo['ext'][$fileType];

            $ret = file_put_contents($uploadDir . $fileName, $fileBlob);
            if ($ret) {
                $out[] = $fileName;
            }
        }
        return $out;
    }

    public static function openCopyFiles($tp, $id)
    {
        $resInfo = self::upload($tp, $id);
        $src     = $resInfo['devpath'];
        $target  = $resInfo['pubpath'];
        $cmd     = "rsync -av {$src} {$target}";
        exec($cmd, $output, $ret);
        if ($ret == 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function cosCopyFiles($appInfo)
    {
        $appid = $appInfo['appid'];
        if ($appInfo['game_type'] == 0) {
            $tp = "webgame";
        } else {
            $tp = "vrgame";
        }
        $resInfo = self::url($tp, $appid, $appInfo['img_version'], $appInfo['img_slider'], true, $appInfo['screenshots']);
        foreach ($resInfo as $value) {
            if (is_array($value)) {
                foreach ($value as $val) {
                    $urls[] = $val;
                }
            } else {
                $pos = strpos($value, '?');
                if ($pos > 0) {
                    $urls[] = substr($value, 0, $pos);
                } else {
                    $urls[] = substr($value);
                }
            }
        }
        $rsync      = true;
        $serverCfg  = Config::get("server");
        $requestUrl = $serverCfg['img_request_url'];
        $cosAppId   = $serverCfg['cos'][0];
        $bucket     = 'vronline1';
        foreach ($urls as $url) {
            $rsync_ret = self::cosCopyFile($cosAppId, $bucket, $requestUrl, $url);
            if (!$rsync_ret) {
                $rsync = false;
            }
        }
        return $rsync;
    }

    private static function cosCopyFile($appid, $bucket, $baseUrl, $url)
    {

        $fileInfo = self::getFile($url);
        if (!$fileInfo) {
            return false;
        }
        $path       = str_replace("dev", "pub", $url);
        $requestUrl = $baseUrl . $appid . "/" . $bucket . "/0/" . urlencode($path);
        $sign       = ImageHelper::imgSignBase($path, $bucket, time() + 120, 0);
        $sha1       = $fileInfo[0];
        $size       = $fileInfo[1];
        $params     = ["Sha" => $sha1, "Op" => "upload_slice", "FileSize" => $size, "Slice_size" => 3145728];

        $copyRes = HttpRequest::cosPost($requestUrl, $sign, $params);

        if (isset($copyRes['code'])) {
            if ($copyRes['code'] == -1886) {
                $retDel = self::cosDelFile($requestUrl, $bucket, $path);
                if ($retDel) {
                    $copyRes = HttpRequest::cosPost($requestUrl, $sign, $params);
                    if (isset($copyRes['code']) && $copyRes['code'] == 0) {
                        return true;
                    }
                }
            } else {
                if ($copyRes['code'] == 0) {
                    return true;
                }
            }
        }
        return false;
    }

    private static function cosDelFile($requestUrl, $bucket, $path)
    {
        $requestUrl .= "/del";
        $sign   = ImageHelper::imgSignBase($path, $bucket, time() + 60, 1);
        $delRes = HttpRequest::cosPost($requestUrl, $sign, []);
        if (isset($delRes['code']) && $delRes['code'] == 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function cosUploadFile($uid, $file)
    {
        $resInfo = self::path("userimg", $uid);
        $remote  = $resInfo['remote_120'];

        list($appId, $secretId, $secretKey) = Config::get("server.cos");
        $url                                = 'http://web.file.myqcloud.com/files/v1/' . $appId . "/" . $resInfo['bucket'] . $remote;
        $sign                               = self::appSignBase($appId, $secretId, $secretKey, time() + 60, null, $resInfo['bucket'], false);

        $sha1   = hash_file('sha1', $file);
        $params = array(
            'op'       => 'upload',
            'sha'      => $sha1,
            'biz_attr' => '',
        );
        $params['filecontent'] = curl_file_create($file);
        $params['insertOnly']  = 0;

        $res = HttpRequest::cosPost($url, $sign, $params);
        if ($res && isset($res['code']) && $res['code'] == 0) {
            unlink($file);
            return $res;
        } else {
            return $res;
        }
    }

    public static function saveFile($name, $sha1, $fileSize)
    {
        $str = [$sha1, $fileSize];
        $ret = Vredis::set("cos_file", $name, json_encode($str));
        Vredis::close();
        return $ret;
    }

    public static function getFile($name)
    {
        $str = Vredis::get("cos_file", $name);
        Vredis::close();
        if ($str) {
            return json_decode($str, true);
        } else {
            return false;
        }

    }

    public static function imgSignBase($fileId, $bucketName, $expired, $once)
    {
        list($appId, $secretId, $secretKey) = Config::get("server.cos");
        $puserid                            = 0;
        $now                                = time();
        $rdm                                = rand();
        if ($once == 1) {
            $expired = 0;
        }
        $plainText = 'a=' . $appId . '&b=' . $bucketName . '&k=' . $secretId . '&e=' . $expired . '&t=' . $now . '&r=' . $rdm . '&u=' . $puserid . '&f=' . $fileId;
        $bin       = hash_hmac("SHA1", $plainText, $secretKey, true);
        $bin       = $bin . $plainText;
        $sign      = base64_encode($bin);
        return $sign;
    }

    public static function videoSignBase($bucketName, $expired)
    {
        $fileId                             = null;
        list($appId, $secretId, $secretKey) = Config::get("server.cos");
        $now                                = time();
        $rdm                                = rand();
        $plainText                          = "a=$appId&k=$secretId&e=$expired&t=$now&r=$rdm&f=$fileId&b=$bucketName";
        $bin                                = hash_hmac('SHA1', $plainText, $secretKey, true);
        $bin                                = $bin . $plainText;
        $sign                               = base64_encode($bin);
        return $sign;
    }

    public static function appSignBase($appId, $secretId, $secretKey, $expired, $fileId, $bucketName, $json = true)
    {
        $now       = time();
        $rdm       = rand();
        $plainText = "a=$appId&k=$secretId&e=$expired&t=$now&r=$rdm&f=$fileId&b=$bucketName";
        $bin       = hash_hmac('SHA1', $plainText, $secretKey, true);
        $bin       = $bin . $plainText;
        $sign      = base64_encode($bin);
        if (!$json) {
            return $sign;
        } else {
            $json = array('code' => '0', 'message' => '成功', 'data' => array('sign' => $sign));
            return json_encode($json);
        }
    }

    public static function localImg($url)
    {
        $url = str_replace(["&amp;", 'tp=webp'], ["&", 'tp=jpg'], $url);

        $img = file_get_contents($url);
        if (!$img) {
            return false;
        }
        $extArr = explode('.', $url);
        $end    = strtolower(end($extArr));
        if (strstr("gif", $end)) {
            $ext = "gif";
        } elseif (strstr("png", $end)) {
            $ext = "png";
        } else {
            $ext = "jpg";
        }
        $fileName  = md5($img) . "." . $ext;
        $uploadDir = "../upload/news/";
        if (!file_exists($uploadDir)) {
            self::mkdirs($uploadDir);
        }
        $ret = file_put_contents($uploadDir . $fileName, $img);
        if ($ret) {
            $path = self::newsUploadFile($uploadDir, $fileName);
            if ($path) {
                unlink($uploadDir . $fileName);
                return $path;
            } else {
                return false;
            }
        }
        return false;
    }

    public static function videoTranscoding($fileName, $ops = 'avthumb/mp4/vcodec/libx264/crf/30', $name = 'blue')
    {
        $ak = "c91f234f4050e303f74c30e0d056f11f21241d93";
        $sk = "bedcf5564aeb498fa87a7bc7c9d5acab54a0dd70";

        $bucket = "vronline-video";
        $body   = 'bucket=' . Library::base64Urlsafeencode($bucket);
        $body .= '&key=' . Library::base64Urlsafeencode($fileName);
        $newName      = str_replace(".mp4", "_$name.mp4", $fileName);
        $newNameParam = "|saveas/" . Library::base64Urlsafeencode($bucket . ":" . $newName);
        $fops         = Library::base64Urlsafeencode($ops . $newNameParam);
        $body .= '&fops=' . $fops;

        $authStr     = "/fops\n$body";
        $sign        = hash_hmac('sha1', $authStr, $sk, false);
        $encodeSign  = Library::base64Urlsafeencode($sign);
        $accessToken = $ak . ':' . $encodeSign;
        $url         = "http://vronline.mgr9.v1.wcsapi.com/fops";

        $resStr = HttpRequest::post($url, $body, 0, [], ['Authorization:' . $accessToken]);
        if ($resStr) {
            $res = json_decode($resStr, true);
            if (isset($res['persistentId'])) {
                return $res['persistentId'];
            }
        }
        return false;
    }

    private static function newsUploadFile($uploadDir, $fileName)
    {
        $serverCfg  = Config::get("server");
        $baseUrl    = $serverCfg['img_request_url'];
        $cosAppId   = $serverCfg['cos'][0];
        $bucket     = 'vronline1';
        $path       = 'newsimg/auto/' . $fileName;
        $requestUrl = $baseUrl . $cosAppId . "/" . $bucket . "/0/" . urlencode($path);
        $sign       = ImageHelper::imgSignBase($path, $bucket, time() + 120, 0);
        $filePath   = $uploadDir . $fileName;
        $params     = [];
        if (function_exists('curl_file_create')) {
            $params['FileContent'] = curl_file_create(realpath($filePath));
        } else {
            $params['FileContent'] = '@' . realpath($filePath);
        }
        $copyRes = HttpRequest::cosPost($requestUrl, $sign, $params);
        if (isset($copyRes['code'])) {
            if ($copyRes['code'] == -1886) {
                return $path;
            } else {
                if ($copyRes['code'] == 0) {
                    return $path;
                }
            }
        }
        return false;
    }

    private static function randName()
    {
        return str_random(15);
    }

    private static function mkdirs($dir)
    {
        return is_dir($dir) or (self::mkdirs(dirname($dir)) and mkdir($dir, 0777));
    }

}
