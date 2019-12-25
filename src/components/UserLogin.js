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
            <div className="container main">
                <img src={require('./../common/holder.jpg')} style={{"height": "80px", "border-radius": "80px", "border": "none"}}/>
                        <div className="login-box">
                            <form className="form-signin">
                                <div className="input-line">
                                    <span className="glyphicon glyphicon-envelope"/>
                                    <label htmlFor="inputEmail" className="sr-only">Email address</label>
                                    <input type='text' id="inputEmail" className="input-box"
                                        placeholder="Username" required autoFocus  onInput={(e=>{
                                        this.setUserInfo(e, 'username')
                                    })}/>
                                </div>
                                <div className="input-line">
                                    <span className="glyphicon glyphicon-lock"/>
                                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                                    <input type="password" id="inputPassword" className="input-box"
                                        placeholder="Password" required  onInput={(e=>{
                                        this.setUserInfo(e, 'password')
                                    })}/>
                                </div>
                                {/* <div className="checkbox" style={{'margin-bottom': '30px'}}>
                                    <label>
                                        <input type="checkbox" value="remember-me"/> Remember me
                                    </label>
                                </div> */}
                                <div className="btn-container">
                                    <button className="btn my-btn" type="submit" onClick={() => {
                                        let p = this.props.passport == null ? new Passport() : this.props.passport;
                                        p.login(this.state.username, this.state.password, () => {
                                            this.props.history.push('/');
                                        });
                                    }}>登录</button>
                                    <button className="btn my-btn" type="submit" onClick={() => {
                                        let p = this.props.passport == null ? new Passport() : this.props.passport;
                                        p.register(this.state.username, this.state.password, () => {
                                            this.props.history.push('/');
                                        });
                                    }}>注册</button>
                                </div>
                            </form>
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