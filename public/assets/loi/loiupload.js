function loiUploadContainer(op) {
    var that = this;
    var $container = $("#" + op.container);
    var $choose = $("#" + op.choose);
    if ($container.length < 1 || $choose.length < 1) {
        return false;
    }
    var container = $container[0];
    var choose = $choose[0];
    var max;

    $container.css("position", "relative");
    $container.css("zIndex", "1");

    var fileInputId = that.randId();
    var accept = "*/*";
    if (op.ext) {
        accept = that.getAccept(op.ext);
    }
    if(op.max) {
       that.max = op.max;
    }

    var pos = that.getPos(choose, container);
    var size = that.getSize(choose);
    var upContainer = document.createElement('div');
    upContainer.id = fileInputId;
    upContainer.style.position = 'absolute';
    upContainer.style.overflow = 'hidden';
    upContainer.style.top = pos.y + "px";
    upContainer.style.left = pos.x + "px";
    upContainer.style.width = size.w + "px";
    upContainer.style.height = size.h + "px";


    input = document.createElement('input');
    input.id = fileInputId + "file";
    input.style.fontSize = '999px';
    input.style.opacity = 0;
    input.style.position = 'absolute';
    input.style.top = 0;
    input.style.left = 0;
    input.style.margin = 0;
    input.style.width = '100%',
    input.style.height = '100%',

    input.setAttribute('type', "file");
    input.setAttribute('accept', accept);
    upContainer.appendChild(input);

    container.appendChild(upContainer);

    that.inputId = fileInputId + "file";
    $choose.click(function() {
        $("#" + fileInputId + "file").trigger("click");
    });

    $(document).on("change", "#" + fileInputId + "file", function() {
        var files = $(this).prop("files")
        if (op.filesAdd) {
            op.filesAdd(files)
        }
        if(typeof(files[0])=="undefined") {
            if(typeof(op.upload.error)!="undefined") {
                op.upload.error("文件信息错误")
            }
             return 
        }
        if(that.max) {
           if(files[0].size>that.max) {
            if(typeof(op.upload.error)!="undefined") {
               op.upload.error("超过上传大小限制")
            }
            return ;
           }
        }
        if(op.ext) {
            if(that.checkExt(files[0].type,op.ext)==false) {
                if(typeof(op.upload.error)!="undefined") {
                    op.upload.error("文件类型不正确");
                }
                return;
            }
        }
        if (op.upload) {
            if (op.upload.err) {
                op.upload.error(null, op.upload.err);
                return;
            }
            if (op.upload.tp == "openuser" || op.upload.tp == "openapp" || op.upload.tp == "tob_idcard" || op.upload.tp == "tob_license") {
                that.upload(op.upload.tp, files[0], op.upload.success, op.upload.error, op.upload.addParams);
            }  else if (op.upload.tp == "netcvideo") {
                that.netcUpload(op.upload.tp, files[0], op.upload.success,op.upload.sliceback, op.upload.error, op.upload.addParams);
            } else if (op.upload.tp != "video") {
                that.cosUpload(op.upload.tp, files[0], op.upload.success, op.upload.error, op.upload.addParams);
            } else {
                that.op = op;
                that.file = files[0];
            }
        }
        $(this).replaceWith($(this)[0].outerHTML);
    });
}

loiUploadContainer.prototype.getPos = function(node, root) {
    var x = 0,
        y = 0,
        parent, doc = document,
        nodeRect, rootRect;

    node = node;
    root = root || doc.body;

    // Returns the x, y cordinate for an element on IE 6 and IE 7
    function getIEPos(node) {
        var bodyElm, rect, x = 0,
            y = 0;

        if (node) {
            rect = node.getBoundingClientRect();
            bodyElm = doc.compatMode === "CSS1Compat" ? doc.documentElement : doc.body;
            x = rect.left + bodyElm.scrollLeft;
            y = rect.top + bodyElm.scrollTop;
        }

        return {
            x: x,
            y: y
        };
    }

    // Use getBoundingClientRect on IE 6 and IE 7 but not on IE 8 in standards mode
    if (node && node.getBoundingClientRect && $.browser === 'IE' && (!doc.documentMode || doc.documentMode < 8)) {
        nodeRect = getIEPos(node);
        rootRect = getIEPos(root);

        return {
            x: nodeRect.x - rootRect.x,
            y: nodeRect.y - rootRect.y
        };
    }

    parent = node;
    while (parent && parent != root && parent.nodeType) {
        x += parent.offsetLeft || 0;
        y += parent.offsetTop || 0;
        parent = parent.offsetParent;
    }

    parent = node.parentNode;
    while (parent && parent != root && parent.nodeType) {
        x -= parent.scrollLeft || 0;
        y -= parent.scrollTop || 0;
        parent = parent.parentNode;
    }

    return {
        x: x,
        y: y
    };
}

loiUploadContainer.prototype.getSize = function(node) {
    return {
        w: node.offsetWidth || node.clientWidth,
        h: node.offsetHeight || node.clientHeight
    };
};

loiUploadContainer.prototype.randId = function() {
    return Math.random().toString(36).substr(2);
}

loiUploadContainer.prototype.getAccept = function(name) {
    var names = name.split(",");
    var arr = this.exts(1);
    var out = [];
    for (var i = 0; i < names.length; i++) {
        out.push(arr[names[i]]);
    }
    return out.join(",");
}

loiUploadContainer.prototype.exts = function(swap) {
     var arr = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/gif": "gif",
        "video/mp4": "mp4"
    }
    if(typeof(swap)!="undefined") {
      var ret = {};
      for(var key in arr){
        ret[arr[key]] = key;
      }
      return ret;
    } else {
        return arr
    }
}

loiUploadContainer.prototype.checkExt = function (typeName,exts) {
    var arr = this.exts();
    if(typeof(arr[typeName])=="undefined") {
        return false;
    } else {
        var ext = arr[typeName];
        var extNames = exts.split(",");
        for(var i=0;i<extNames.length;i++) {
            if(extNames[i]==ext) {
                return true
            }
        }
        return false;
    }
}

loiUploadContainer.prototype.getFileName = function(tp, file) {
    var arr = this.exts();
    var extName = arr[file.type];
    var str = file.name + file.size + file.type + file.lastModified;
    var date = new Date();
    if (tp == "video" || tp=="netcvideo") {
        str = md5(str) + "." + extName;
    } else {
        var unixtime = date.getTime();
        str = md5(str) + unixtime + "." + extName;
    }
    return str;
}

loiUploadContainer.prototype.upload = function(tp, file, callback, errback, addParams) {
    var formData = new FormData();
    if (typeof(addParams) != "undefined") {
        $.each(addParams, function(k, v) {
            formData.append(k, v);
        })
    }
    formData.append('tp', tp);
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

loiUploadContainer.prototype.cosUpload = function(tp, file, callback, errback, addParams) {
    var name = this.getFileName(tp, file);
    var cos = new Cos(tp);
    if (typeof(addParams) == "object") {
        cos.setSignParams(addParams);
    }
    cos.uploadFile(callback, errback, name, file);
}


loiUploadContainer.prototype.netcUpload = function(tp, file, callback, sliceback,errback, addParams) {
    var name = this.getFileName(tp, file);
    var cos = new Cos(tp);
    if (typeof(addParams) == "object") {
        cos.setSignParams(addParams);
    }
    cos.sliceUpload(callback, sliceback,errback, name, file);
}


loiUploadContainer.prototype.startUpload = function() {
    var callback = this.op.upload.success;
    var errback = this.op.upload.error;
    var sliceback = this.op.upload.sliceback;
    var file = this.file;
    var tp = this.op.upload.tp;
    var addParams = this.op.upload.addParams;

    var name = this.getFileName(tp, file);
    var cos = new Cos(tp);
    if (typeof(addParams) == "object") {
        cos.setSignParams(addParams);
    }
    cos.sliceUploadFile(callback, sliceback, errback, name, file, 0);
}