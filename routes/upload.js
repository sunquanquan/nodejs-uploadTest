/**
 * Created by quanquan.sun on 2017/8/14.
 */
var express = require('express');
var util = require('util');
var https = require('https');
var exec = require('shelljs').exec;
var aaptPath = "D:/software/aapt/aapt";// aapt命令 路径
var formidable = require('formidable');
var fs = require('fs');

router = express.Router();

var TITLE = 'formidable上传示例';
var AVATAR_UPLOAD_FOLDER = '/avatar/';

router.get('/',function(req,res){
    var  json = {
        'name':"",
        'pkg':"",
        'appName':"",
        'verCode':"",
        'verName':"",
        'fileSize':""
    };
    res.render('upload',json);
});

router.post('/',function(req,res){
    console.log('ajax');
    var path = __dirname;
    path = path.split('\\routes')[0];
    console.log(path);
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('出错');
            res.locals.error = err;
            res.render('upload', {title: TITLE});
            return;
        }
        var tmp_path = files.thumbnail.path;
        console.log("temp_path:   "+tmp_path);
        var target_path = 'public/files/' + files.thumbnail.name;
        console.log("target_path:     "+target_path);

        // 移动文件
        fs.renameSync(tmp_path, target_path, function(err) {
            if (err) throw err;
            // 删除临时文件夹文件,
            fs.unlink(tmp_path, function(err) {
                if (err) throw err;
                res.send('File uploaded to: ' + target_path + ' - ' + files.thumbnail.size + ' bytes');
            });
        });

        exec(aaptPath + " dump badging " + target_path,
            function (error, stdout, stderr) {
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                var str1 = stdout.toString();
                var packageNameAnalysis1=String(str1.match("name='.*' versionCode"));
                var packageNameAnalysis2=String(packageNameAnalysis1.match("'.*'"));
                var packageName=packageNameAnalysis2.substring (1,packageNameAnalysis2.indexOf('\'',1));//取包名
                console.log("packageName",packageName);
                var versionCodeAnalysis1=String(str1.match("versionCode='.*' versionName"));
                var versionCodeAnalysis2=String(versionCodeAnalysis1.match("'.*'"));
                var versionCode=versionCodeAnalysis2.substring (1,versionCodeAnalysis2.indexOf('\'',1));//取系统版本
                console.log("versionCode",versionCode);
                var verCode = parseInt(versionCode);
                var versionNameAnalysis1=String(str1.match("versionName='.*'"));
                var versionNameAnalysis2=String(versionNameAnalysis1.match("'.*'"));
                var versionName=versionNameAnalysis2.substring (1,versionNameAnalysis2.indexOf('\'',1));//取版本号
                console.log("versionName",versionName);
                var applicationLabelAnalysis1=String(str1.match("application-label:'.*'"));
                var applicationLabelAnalysis2=String(applicationLabelAnalysis1.match("'.*'"));
                var applicationLabel=applicationLabelAnalysis2.substring (1,applicationLabelAnalysis2.indexOf('\'',1));//取应用名称
                console.log("applicationLabel",applicationLabel);
                var name = files.thumbnail.name;

                var  json = {
                    'name':name,
                    'pkg':packageName,
                    'appName':applicationLabel,
                    'verCode':verCode,
                    'verName':versionName,
                    'fileSize':files.thumbnail.size
                };
                res.json(json);
            })
    });
});
module.exports = router;