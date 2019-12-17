import MyRouter from "./components/MyRouter";
import React from 'react';
// 引入样式
require('style/index.css');
var superagent = require('superagent');

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            route: 'login',
            username: '',
            password: '',
            viewType: 'today',
        };

        this.changeViewType = this.changeViewType.bind(this);
        this.setUserInfo = this.setUserInfo.bind(this);
        this.changePage = this.changePage.bind(this);
        this.login = this.login.bind(this);
    }
    // TODO: add function
    setUserInfo(event, key) {
        let obj = {};
        obj[key] = event.target.value;
        this.setState(obj);
    }

    changeViewType(type){

        this.setState({
            viewType: type
        });
    }

    changePage(route){
        this.setState({
            route: route
        })
    }

    login(username, password){
        let changePage = this.changePage;
        superagent
            .post('http://127.0.0.1:8080/login?SecretKey=kdK4AnNlLm')
            .send({
                    "username":username,
                    "password":password
            })
            .end(function(err, res) {
                if (err) {
                    alert('err');
                } else {
                    let json = JSON.parse(res.text);
                    let code = json['error_code'];
                    if(code === 0){
                        alert('yes');
                        changePage('xxx');
                    } else {
                        alert('WRONG username or password!!!');
                    }
                }
            })
    }

    render() {
        return (
            <MyRouter/>
        );
    }
}






ReactDOM.render(
    <App/>,
    document.getElementById('root'),
    ()=>{console.log("zouyang的第一个todo例子渲染完成啦...")}
);

if(module.hot)
{
    module.hot.accept();
}