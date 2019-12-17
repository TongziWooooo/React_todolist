

var superagent = require('superagent');

export default class Passport {
    constructor() {
        this.isLogin = false;
        this.token = '';
    }

    login(username, password, callback){
        if (username === '' || password === '') {
            return
        }
        let that = this;
        superagent
            .post('http://127.0.0.1:8080/login?SecretKey=kdK4AnNlLm')
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
                        that.token = json['data']['token'];
                        alert('登陆成功！');
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
            .post('http://127.0.0.1:8080/register?SecretKey=kdK4AnNlLm')
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