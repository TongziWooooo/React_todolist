

var superagent = require('superagent');

export default class Passport {
    constructor() {
        this.isLogin = false;
        this.token = '';
        this.username = '';
    }

    login(username, password, callback){
        if (username === '' || password === '') {
            return
        }
        let that = this;
        superagent
            .post('http://aliyun.nihil.top:10999/login?SecretKey=kdK4AnNlLm')
            .send({
                "username":username,
                "password":password
            })
            .end(function(err, res) {
                if (err) {
                    that.isLogin = false;
                    alert('用户名或密码错误！');
                } else {
                    let json = JSON.parse(res.text);
                    let code = json['error_code'];
                    if (code === 0){
                        that.isLogin = true;
                        that.username = username;
                        that.token = json['data']['token'];
                        alert('登录成功！');
                        callback();
                    } else {
                        that.isLogin = false;
                        alert('用户名或密码错误！');
                    }
                }
            });

    }

    register(username, password, callback){
        if (username === '' || password === '') {
            return
        }
        let that = this;
        superagent
            .post('http://aliyun.nihil.top:10999/register?SecretKey=kdK4AnNlLm')
            .send({
                "username":username,
                "password":password
            })
            .end(function(err, res) {
                if (err) {
                    that.isLogin = false;
                    alert('用户名已存在！');
                } else {
                    let json = JSON.parse(res.text);
                    let code = json['error_code'];
                    if (code === 0){
                        that.isLogin = true;
                        that.username = username;
                        that.token = json['data']['token'];
                        alert('注册成功！');
                        callback();
                    } else {
                        that.isLogin = false;
                        alert('用户名已存在！');
                    }
                }
            });

    }

}