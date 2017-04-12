function Crop(file) {
    this.file = file
}

Crop.prototype.getObjectURL = function() {
    var url = null;
    if (window.createObjectURL != undefined) {
        url = window.createObjectURL(this.file)
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(this.file)
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(this.file)
    }
    return url
}

Crop.prototype.show = function(callback, errback) {

    var filepath=this.file.name;
    var extStart=filepath.lastIndexOf(".");
    var ext=filepath.substring(extStart,filepath.length).toUpperCase();
    if(ext!=".BMP" && ext!=".PNG"&&ext!=".GIF"&&ext!=".JPG"&&ext!=".JPEG"){
        errback({
            code: -1,
            msg: "图片限于png,gif,jpeg,jpg格式"
        });
        return false;
    }

    if (this.file.size > 2 * 1024 * 1024) {
        errback({
            code: -1,
            msg: "文件超过2M"
        });
        return false;
    }
    var that = this
    if ($(".fire_crop_wrap_out").length >= 1) {
        $(".fire_crop_wrap_out").show()
    } else {
        var html = '<style>.fire_crop_wrap_out{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1000;overflow:auto;display:block}.fire_crop_wrap{position:fixed;width:100%;top:15%;left:0;z-index:10000;font-size:16px;text-align:center;font-size:16px}.fire_crop{display:inline-block;text-align:left;width:500px;height:480px;background:#FFF;position:relative;padding:5px 20px 20px 20px;border:1px rgba(0,0,0,.4) solid;border-radius:2px;background-color:white;box-shadow:1px 1px 5px 2px rgba(0,0,0,0.2)}.fire_crop .title{color:#212a31;line-height:40px;font-weight:600;font-size:16px}.fire_crop .crop{width:80%;max-width:400px;max-height:400px}.fire_crop .crop-preview{display:block;position:absolute;z-index:2000;top:0;right:-80px;padding:2px;border:1px rgba(0,0,0,.4) solid;border-radius:2px;background-color:white;box-shadow:1px 1px 5px 2px rgba(0,0,0,0.2)}.crop-preview .preview-container{width:60px;height:60px;overflow:hidden}.fire_crop_btn{position:absolute;bottom:10px;left:240px;width:100px;height:30px;color:#333;background-color:#fff;border-color:red;font-size:14px;font-weight:400;line-height:30px;text-align:center;cursor:pointer;border:1px solid #ccc;border-radius:4px}</style><div class="fire_crop_wrap_out"><div class="fire_crop_wrap"><div class="fire_crop"><div class="title">剪裁头像</div><img id="crop" class="crop" src="' + this.getObjectURL() + '" />' +
            '<div class="crop-preview "><div class="preview-container"><img src="' + this.getObjectURL() + '" class="jcrop-preview" alt="Preview"></div>' +
            '</div><div style="left:160px;" class="fire_crop_btn fire_crop_submit">确定</div><div style="left:290px;" class="fire_crop_btn fire_crop_cancel">取消</div></div></div></div>';
        $("body").append(html);
    }
    var jcrop_api,
        boundx,
        boundy,
        $preview = $('.crop-preview'),
        $pcnt = $('.crop-preview  .preview-container'),
        $pimg = $('.crop-preview .preview-container img'),
        xsize = $pcnt.width(),
        ysize = $pcnt.height();
    var myjcrop = $('#crop').Jcrop({
        onChange: updatePreview,
        onSelect: updatePreview,
        onDblClick: function() {
            save()
        },
        onRelease: function() {},
        aspectRatio: 1,
        minSize: [61, 61],
        minSelect: [60, 60]
    }, function() {
        var bounds = this.getBounds();
        boundx = bounds[0];
        boundy = bounds[1];
        jcrop_api = this;
        $preview.appendTo(jcrop_api.ui.holder);
        jcrop_api.setSelect([150, 0, 270, 120]);
    });

    function updatePreview(c) {
        if (parseInt(c.w) > 0) {
            var rx = xsize / c.w;
            var ry = ysize / c.h;
            $pimg.css({
                width: Math.round(rx * boundx) + 'px',
                height: Math.round(ry * boundy) + 'px',
                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                marginTop: '-' + Math.round(ry * c.y) + 'px'
            });
        }
    }
    $(".fire_crop_submit").click(function() {
        save();
    });
    $(".fire_crop_cancel").click(function() {
        jcrop_api.destroy();
        $(".fire_crop_wrap_out").remove();
        $('#head_photo').replaceWith('<input type="file" name="head_photo" id="head_photo">');
    })

    function save() {
        var img_size = jcrop_api.getWidgetSize();
        var img_choose_size = jcrop_api.tellScaled();
        if (img_choose_size.w < 60 || img_choose_size.h < 60) {
            errback({
                code: -1,
                msg: "请选择头像区域"
            });
        } else {
            jcrop_api.destroy();
            $(".fire_crop_wrap_out").remove();
            var webc = new webCrop(that.file, img_size, img_choose_size, callback, errback);
        }
    }
}

function webCrop(file, img_size, img_choose_size, callback, errback) {

    var that = this
    if (typeof(FileReader) == "undefined" || typeof(atob) == "undefined" || typeof(Blob) == "undefined") {
        that.upload(file, img_size, img_choose_size, callback, errback)
        return false;
    }
    var width = 120,
        height = 120;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (function(e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function() {
            var scale = this.width / img_size[0];
            var img_real_w = img_choose_size.w * scale;
            var img_real_h = img_choose_size.h * scale;
            var img_real_x = img_choose_size.x * scale;
            var img_real_y = img_choose_size.y * scale;
            var canvas = $('<canvas id="cropcanvas"  width="' + width + '" height="' + height + '"></canvas>')[0],
                ctx = canvas.getContext('2d');
            ctx.scale(width / img_real_w, height / img_real_h);
            ctx.drawImage(image, img_real_x, img_real_y, img_real_w, img_real_h, 0, 0, img_real_w, img_real_h);
            // $(document.body).append(canvas);
            var compressed = canvas.toDataURL("image/png", 0.9);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // $("#cropcanvas").remove();
            data = compressed.split(',')[1];
            data = atob(data);
            var ia = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i);
            };
            var blob = new Blob([ia], {
                type: "image/png"
            });
            that.cosUpload(blob, callback, errback)
        };
    });
    return true;
}

webCrop.prototype.cosUpload = function(file, callback, errback) {
    var cos = new Cos("userimg");
    var fileName = "120.png";
    cos.uploadFile(callback, errback,  fileName, file);
}

webCrop.prototype.upload = function(file, img_size, img_choose_size, callback, errback) {
    var formData = new FormData();
    formData.append('tp', "userimg");
    formData.append('img_size', JSON.stringify(img_size));
    formData.append('img_choose_size', JSON.stringify(img_choose_size));
    formData.append('file', file);
    $.ajax({
        url: "/upload/start",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: callback,
        error: errback
    });
}