var CryptoJS = CryptoJS || function(e, m) {
    var p = {},
        j = p.lib = {},
        l = function() {},
        f = j.Base = { extend: function(a) { l.prototype = this;
                var c = new l;
                a && c.mixIn(a);
                c.hasOwnProperty("init") || (c.init = function() { c.$super.init.apply(this, arguments) });
                c.init.prototype = c;
                c.$super = this;
                return c }, create: function() {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a }, init: function() {}, mixIn: function(a) {
                for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function() {
                return this.init.prototype.extend(this) } },
        n = j.WordArray = f.extend({
            init: function(a, c) { a = this.words = a || [];
                this.sigBytes = c != m ? c : 4 * a.length },
            toString: function(a) {
                return (a || h).stringify(this) },
            concat: function(a) {
                var c = this.words,
                    q = a.words,
                    d = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (d % 4)
                    for (var b = 0; b < a; b++) c[d + b >>> 2] |= (q[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((d + b) % 4);
                else if (65535 < q.length)
                    for (b = 0; b < a; b += 4) c[d + b >>> 2] = q[b >>> 2];
                else c.push.apply(c, q);
                this.sigBytes += a;
                return this },
            clamp: function() {
                var a = this.words,
                    c = this.sigBytes;
                a[c >>> 2] &= 4294967295 <<
                    32 - 8 * (c % 4);
                a.length = e.ceil(c / 4)
            },
            clone: function() {
                var a = f.clone.call(this);
                a.words = this.words.slice(0);
                return a },
            random: function(a) {
                for (var c = [], b = 0; b < a; b += 4) c.push(4294967296 * e.random() | 0);
                return new n.init(c, a) }
        }),
        b = p.enc = {},
        h = b.Hex = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var b = [], d = 0; d < a; d++) {
                    var f = c[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                    b.push((f >>> 4).toString(16));
                    b.push((f & 15).toString(16)) }
                return b.join("") },
            parse: function(a) {
                for (var c = a.length, b = [], d = 0; d < c; d += 2) b[d >>> 3] |= parseInt(a.substr(d,
                    2), 16) << 24 - 4 * (d % 8);
                return new n.init(b, c / 2)
            }
        },
        g = b.Latin1 = { stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var b = [], d = 0; d < a; d++) b.push(String.fromCharCode(c[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                return b.join("") }, parse: function(a) {
                for (var c = a.length, b = [], d = 0; d < c; d++) b[d >>> 2] |= (a.charCodeAt(d) & 255) << 24 - 8 * (d % 4);
                return new n.init(b, c) } },
        r = b.Utf8 = { stringify: function(a) {
                try {
                    return decodeURIComponent(escape(g.stringify(a))) } catch (c) {
                    throw Error("Malformed UTF-8 data"); } }, parse: function(a) {
                return g.parse(unescape(encodeURIComponent(a))) } },
        k = j.BufferedBlockAlgorithm = f.extend({
            reset: function() { this._data = new n.init;
                this._nDataBytes = 0 },
            _append: function(a) { "string" == typeof a && (a = r.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes },
            _process: function(a) {
                var c = this._data,
                    b = c.words,
                    d = c.sigBytes,
                    f = this.blockSize,
                    h = d / (4 * f),
                    h = a ? e.ceil(h) : e.max((h | 0) - this._minBufferSize, 0);
                a = h * f;
                d = e.min(4 * a, d);
                if (a) {
                    for (var g = 0; g < a; g += f) this._doProcessBlock(b, g);
                    g = b.splice(0, a);
                    c.sigBytes -= d }
                return new n.init(g, d) },
            clone: function() {
                var a = f.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    j.Hasher = k.extend({
        cfg: f.extend(),
        init: function(a) { this.cfg = this.cfg.extend(a);
            this.reset() },
        reset: function() { k.reset.call(this);
            this._doReset() },
        update: function(a) { this._append(a);
            this._process();
            return this },
        finalize: function(a) { a && this._append(a);
            return this._doFinalize() },
        blockSize: 16,
        _createHelper: function(a) {
            return function(c, b) {
                return (new a.init(b)).finalize(c) } },
        _createHmacHelper: function(a) {
            return function(b, f) {
                return (new s.HMAC.init(a,
                    f)).finalize(b)
            }
        }
    });
    var s = p.algo = {};
    return p
}(Math);
(function() {
    var e = CryptoJS,
        m = e.lib,
        p = m.WordArray,
        j = m.Hasher,
        l = [],
        m = e.algo.SHA1 = j.extend({
            _doReset: function() { this._hash = new p.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]) },
            _doProcessBlock: function(f, n) {
                for (var b = this._hash.words, h = b[0], g = b[1], e = b[2], k = b[3], j = b[4], a = 0; 80 > a; a++) {
                    if (16 > a) l[a] = f[n + a] | 0;
                    else {
                        var c = l[a - 3] ^ l[a - 8] ^ l[a - 14] ^ l[a - 16];
                        l[a] = c << 1 | c >>> 31 }
                    c = (h << 5 | h >>> 27) + j + l[a];
                    c = 20 > a ? c + ((g & e | ~g & k) + 1518500249) : 40 > a ? c + ((g ^ e ^ k) + 1859775393) : 60 > a ? c + ((g & e | g & k | e & k) - 1894007588) : c + ((g ^ e ^
                        k) - 899497514);
                    j = k;
                    k = e;
                    e = g << 30 | g >>> 2;
                    g = h;
                    h = c
                }
                b[0] = b[0] + h | 0;
                b[1] = b[1] + g | 0;
                b[2] = b[2] + e | 0;
                b[3] = b[3] + k | 0;
                b[4] = b[4] + j | 0
            },
            _doFinalize: function() {
                var f = this._data,
                    e = f.words,
                    b = 8 * this._nDataBytes,
                    h = 8 * f.sigBytes;
                e[h >>> 5] |= 128 << 24 - h % 32;
                e[(h + 64 >>> 9 << 4) + 14] = Math.floor(b / 4294967296);
                e[(h + 64 >>> 9 << 4) + 15] = b;
                f.sigBytes = 4 * e.length;
                this._process();
                return this._hash },
            clone: function() {
                var e = j.clone.call(this);
                e._hash = this._hash.clone();
                return e }
        });
    e.SHA1 = j._createHelper(m);
    e.HmacSHA1 = j._createHmacHelper(m)
})();

function swapendian32(val) {
    return (((val & 0xFF) << 24) | ((val & 0xFF00) << 8) | ((val >> 8) & 0xFF00) | ((val >> 24) & 0xFF)) >>> 0;

}

function arrayBufferToWordArray(arrayBuffer) {
    var fullWords = Math.floor(arrayBuffer.byteLength / 4);
    var bytesLeft = arrayBuffer.byteLength % 4;

    var u32 = new Uint32Array(arrayBuffer, 0, fullWords);
    var u8 = new Uint8Array(arrayBuffer);

    var cp = [];
    for (var i = 0; i < fullWords; ++i) {
        cp.push(swapendian32(u32[i]));
    }
    if (bytesLeft) {
        var pad = 0;
        for (var i = bytesLeft; i > 0; --i) {
            pad = pad << 8;
            pad += u8[u8.byteLength - i];
        }

        for (var i = 0; i < 4 - bytesLeft; ++i) {
            pad = pad << 8;
        }

        cp.push(pad);
    }
    return CryptoJS.lib.WordArray.create(cp, arrayBuffer.byteLength);
};

function progressiveRead(file, work, done) {
    var chunkSize = 204800; // 20KiB at a time
    var pos = 0;
    var reader = new FileReader();

    function progressiveReadNext() {
        var end = Math.min(pos + chunkSize, file.size);
        reader.onload = function(e) {
            pos = end;
            work(e.target.result, pos, file);
            if (pos < file.size) {
                setTimeout(progressiveReadNext, 0);
            } else {
                done(file);
            }
        }
        if (file.slice) {
            var blob = file.slice(pos, end);
        } else if (file.webkitSlice) {
            var blob = file.webkitSlice(pos, end);
        }
        reader.readAsArrayBuffer(blob);
    }
    setTimeout(progressiveReadNext, 0);
}

function sha1File(f, callback) {
    var instance = CryptoJS.algo.SHA1.create('SHA1');
    progressiveRead(f,
        function(data, pos, file) {
            var wordArray = arrayBufferToWordArray(data);
            instance.update(wordArray);
        },
        function() {
            var sha1 = instance.finalize().toString()
            callback(sha1)
        });
}


var img_domain = "http://image.vronline.com/";
var video_domain = "http://netctvideo.vronline.com";
//cos start
var SLICE_SIZE_512K = 524288;
var SLICE_SIZE_1M = 1048576;
var SLICE_SIZE_2M = 2097152;
var SLICE_SIZE_3M = 3145728;
var SLICE_SIZE_4M = 4194304;
var MAX_UNSLICE_FILE_SIZE = 20971520;


function Cos(tp) {
    this.appid = 10005081;
    this.sign_url = "/upload/imgCosAppSign/";
    this.netc_sign_url = "/upload/netCenterSign";
    this.tp = tp;
}


Cos.prototype.cosapi_video_url = "https://web.file.myqcloud.com/files/v1/";
Cos.prototype.netc_video_url = "http://vronline.up9.v1.wcsapi.com/";
Cos.prototype.cosapi_img_url = "https://web.image.myqcloud.com/photos/v2/";
Cos.prototype.slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
Cos.prototype.sliceSize = 3 * 1024 * 1024;
Cos.prototype.setSignParams = function(params) {
    this.signParams = params;
}

Cos.prototype.getSliceSize = function(size) {
    var res = SLICE_SIZE_3M;
    if (size <= SLICE_SIZE_512K) {
        res = SLICE_SIZE_512K;
    } else if (size <= SLICE_SIZE_1M) {
        res = SLICE_SIZE_1M;
    } else if (size <= SLICE_SIZE_2M) {
        res = SLICE_SIZE_2M;
    } else if (size <= SLICE_SIZE_3M) {
        res = SLICE_SIZE_3M;
    } else {
        res = SLICE_SIZE_3M;
    }
    return res;
}

Cos.prototype.getAppSign = function(fileName, success, error, once, sha1, size) {
    var url = this.sign_url + "?tp=" + this.tp + "&name=" + fileName;
    if (typeof(this.signParams) == "object") {
        var addUrls = [];
        $.each(this.signParams, function(k, v) {
            addUrls.push(k + '=' + v);
        });
        url += "&" + addUrls.join('&');
    }
    if (typeof(once) != "undefined" && once == true) {
        url += "&once=1";
    }
    if (typeof(sha1) != "undefined") {
        url += "&sha1=" + sha1;
    }
    if (typeof(size) != "undefined") {
        url += "&size=" + size;
    }
    $.ajax({
        url: url,
        type: "GET",
        success: success,
        error: error
    });
}

Cos.prototype.uploadFile = function(success, error, fileName, file) {
    var that = this;
    sha1File(file, function(sha1) {
        var size = file.size;
        that.getAppSign(fileName, function(json) {
            var jsonResult = $.parseJSON(json);
            var sign = jsonResult.data.sign;
            var remotePath = jsonResult.data.remote;
            var bucket = jsonResult.data.bucket;
            var url = that.cosapi_img_url + that.appid + "/" + bucket + '/0/' + encodeURIComponent(remotePath);
            var formData = new FormData();
            formData.append('FileContent', file);
            $.ajax({
                type: 'POST',
                url: url,
                headers: { 'Authorization': 'QCloud ' + sign },
                data: formData,
                processData: false,
                contentType: false,
                success: success,
                error: function(err) {
                    if (typeof(err.responseText) != "undefined") {
                        if (err.responseText.indexOf("-1886") > 0) {
                            that.deleteFile(success, error, fileName, file)
                        }
                    }
                }
            });
        }, error, false, sha1, size);
    });
}

Cos.prototype.deleteFile = function(success, error, fileName, file) {
    var that = this;
    this.getAppSign(fileName, function(json) {
        var jsonResult = $.parseJSON(json);
        var sign = jsonResult.data.sign;
        var remotePath = jsonResult.data.remote;
        var bucket = jsonResult.data.bucket;
        var url = that.cosapi_img_url + that.appid + "/" + bucket + '/0/' + encodeURIComponent(remotePath) + '/del';
        $.ajax({
            type: 'POST',
            url: url,
            headers: { 'Authorization': 'QCloud ' + sign },
            processData: false,
            contentType: false,
            success: function(res) {
                that.uploadFile(success, error, fileName, file);
            },
            error: error
        });
    }, error, true);
}


Cos.prototype.getNetcSign = function(fileName, overwrite, success, error) {
    var url = this.netc_sign_url + "?&name=" + fileName;
    if (typeof(this.signParams) == "object") {
        var addUrls = [];
        $.each(this.signParams, function(k, v) {
            addUrls.push(k + '=' + v);
        });
        url += "&" + addUrls.join('&');
    }
    url += "&overwrite=" + overwrite;
    $.ajax({
        url: url,
        type: "GET",
        success: success,
        error: error
    });
}

Cos.prototype.sliceUpload = function(success, sliceBack, error, fileName, file, insertOnly, optSliceSize) {
    var that = this;
    that.getNetcSign(fileName, 0, function(res) {
        if (res.code == 0) {
            var token = res.data.token
            var date = new Date();
            var uploadBatch = date.getTime()+parseInt(Math.random*10000);
            var offset = 0;
            var sliceNum = 0;
            var ctx = '';
            goSliceUpload(offset, SLICE_SIZE_4M, 0)
            function goSliceUpload(offset, sliceSize, sliceNum) {
                $.ajax({
                    url: that.netc_video_url + 'mkblk/' + sliceSize + '/' + sliceNum,
                    type: "POST",
                    data: that.slice.call(file, offset, offset + sliceSize),
                    headers: {
                        'Authorization': 'UpToken ' + token,
                        'uploadBatch': uploadBatch,
                        'Content-Type': 'application/octet-stream',
                    },
                    processData: false,
                    success: function(json) {
                        ctx = ctx ? ctx + ',' + json.ctx : json.ctx;
                        offset = offset + sliceSize
                        sliceBack(offset/file.size)
                        if (offset >= file.size) {
                            makeFile(file)
                            return;
                        }
                        sliceNum++;
                        if (file.size - offset >= SLICE_SIZE_4M) {
                            newSliceSize = SLICE_SIZE_4M
                        } else {
                            newSliceSize = file.size - offset
                        }
                        goSliceUpload(offset, newSliceSize, sliceNum)
                    },
                    error: error
                });
            }
            function makeFile(file) {
                $.ajax({
                    url: that.netc_video_url + 'mkfile/' + file.size,
                    type: "POST",
                    data: ctx,
                    headers: {
                        'Authorization': 'UpToken ' + token,
                        'uploadBatch': uploadBatch,
                        'Content-Type': 'text/plain;charset=UTF-8'
                    },
                    processData: false,
                    success:success,
                    error: error
                });
            }
        }
    }, error);



}

Cos.prototype.sliceUploadFile = function(success, sliceBack, error, fileName, file, insertOnly, optSliceSize) {
    console.log("sliceUploadFile sha1ing")
    var that = this;
    var reader = new FileReader();
    blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    reader.onload = function(e) {
        if (e.target.result != null) {
            g_totalSize += e.target.result.length;
            if (e.target.result.length != 0) {
                if (!Qh) {
                    Qh = swfobject.getObjectById("qs");
                }
                Qh.ftn_sign_update_dataurl(e.target.result);
            }
        }
        g_currentChunk += 1;
        if (g_currentChunk <= g_chunks) {
            if (g_iDelayReadData > 0) clearTimeout(g_iDelayReadData);
            if (g_LoadFileDelayTime > 0) {
                g_iDelayReadData = setTimeout(nextSlice, g_LoadFileDelayTime);
            } else {
                g_iDelayReadData = 0;
                nextSlice();
            }
        } else {
            var endTime = new Date().getTime();
            g_running = false;
            var sha1 = Qh.ftn_sha1_result();
            console.log("sliceUploadFile go")

            that.getAppSign(fileName, function(json) {
                var jsonResult = $.parseJSON(json);
                var sign = jsonResult.data.sign;
                var remotePath = jsonResult.data.remote;
                var bucketName = jsonResult.data.bucket;
                var session = '';
                var sliceSize = 0;
                var offset = 0;

                var url = that.cosapi_video_url + that.appid + "/" + bucketName + "/" + encodeURI(remotePath) + "?sign=" + encodeURIComponent(sign);
                var formData = new FormData();
                formData.append('op', 'upload_slice');
                formData.append('sha', sha1);
                formData.append('filesize', file.size);
                formData.append("slice_size", that.getSliceSize(optSliceSize));

                if (insertOnly >= 0) {
                    formData.append('insertOnly', insertOnly);
                }
                var getSessionSuccess = function(result) {
                    var jsonResult = $.parseJSON(result);
                    if (jsonResult.data.access_url) {
                        success(result);
                        return;
                    }
                    console.log(jsonResult.data);
                    session = jsonResult.data.session;
                    sliceSize = jsonResult.data.slice_size;
                    offset = jsonResult.data.offset
                    sliceUpload();
                };
                var sliceUpload = function() {
                    that.getAppSign(fileName, function(json) {
                        var jsonResult = $.parseJSON(json);
                        var sign = jsonResult.data.sign;
                        var url = that.cosapi_video_url + that.appid + "/" + bucketName + "/" + encodeURI(remotePath); // + "?sign=" + encodeURIComponent(sign);
                        var formData = new FormData();
                        formData.append('op', 'upload_slice');
                        formData.append('session', session);
                        formData.append('offset', offset);
                        formData.append('fileContent', that.slice.call(file, offset, offset + sliceSize));
                        $.ajax({
                            type: 'POST',
                            url: url,
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: sliceUploadSuccess,
                            error: error
                        });
                    }, error);
                };
                var sliceUploadSuccess = function(result) {
                    var jsonResult = $.parseJSON(result);
                    if (jsonResult.data.offset != undefined) {
                        offset = jsonResult.data.offset + sliceSize;
                        sliceBack(jsonResult.data.offset);
                        sliceUpload();
                    } else {
                        success(result);
                        return;
                    }
                };
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: getSessionSuccess,
                    error: error
                });
            }, error);
        }
    };
    reader.onerror = error;
    var Qh = swfobject.getObjectById("qs");
    var g_LoadFileBlockSize = 2 * 1024 * 1024;
    var g_LoadFileDelayTime = 0;
    var g_chunkId = null;
    var g_totalSize = 0;
    var g_uniqueId = "chunk_" + (new Date().getTime());
    var g_chunks = Math.ceil(file.size / g_LoadFileBlockSize);
    var g_currentChunk = 0;
    var g_running = true;
    var g_startTime = new Date().getTime();
    var g_iDelayReadData = 0;
    var startTime = new Date().getTime();
    var nextSlice = function(i, sliceCount) {
        var start = 0;
        var end = 0;
        start = g_currentChunk * g_LoadFileBlockSize;
        if (file != null) {
            end = ((start + g_LoadFileBlockSize) >= file.size) ? file.size : start + g_LoadFileBlockSize;
            reader.readAsDataURL(that.slice.call(file, start, end));
        }
    };
    nextSlice();
}
