import Passport from './Passport';

require('style/login.css');

export default class UserLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    setUserInfo(event, key) {
        let obj = {};
        obj[key] = event.target.value;
        this.setState(obj);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <div className="login-box">
                            <form className="form-signin">
                                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                                <input type='text' id="inputEmail" className="form-control"
                                       placeholder="Username" required autoFocus  onInput={(e=>{
                                    this.setUserInfo(e, 'username')
                                })}/>
                                <label htmlFor="inputPassword" className="sr-only">Password</label>
                                <input type="password" id="inputPassword" className="form-control"
                                       placeholder="Password" required  onInput={(e=>{
                                    this.setUserInfo(e, 'password')
                                })}/>
                                <div className="checkbox" style={{'margin-bottom': '50px'}}>
                                    <label>
                                        <input type="checkbox" value="remember-me"/> Remember me
                                    </label>
                                </div>
                                <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={() => {
                                    let p = this.props.passport == null ? new Passport() : this.props.passport;
                                    p.login(this.state.username, this.state.password, () => {
                                        this.props.history.push('/');
                                    });
                                }}>登录</button>
                                <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={() => {
                                    let p = this.props.passport == null ? new Passport() : this.props.passport;
                                    p.register(this.state.username, this.state.password, () => {
                                        this.props.history.push('/');
                                    });
                                }}>注册</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            // <div>
            //     <h3>用户登录</h3>
            //     <div>
            //         <span>用户名：</span>
            //         <span><input type="text" onInput={(event) => {
            //             this.setUserInfo(event, 'username');
            //         }} /></span>
            //     </div>
            //     <div>
            //         <span>密码：</span>
            //         <span><input type="password" onInput={(event) => {
            //             this.setUserInfo(event, 'password')
            //         }} /></span>
            //     </div>
            //     <div>
            //         <button onClick={() => {
            //             let p = this.props.passport == null ? new Passport() : this.props.passport;
            //             p.login(this.state.username, this.state.password, () => {
            //                 // 登录成功时，跳转页面
            //                 this.props.history.push('/');
            //             });
            //         }}>登录</button>
            //     </div>
            // </div>
        )
    }
}