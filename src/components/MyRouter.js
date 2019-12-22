import Login from './UserLogin';
import Left from "./Left";
import * as CONSTANT from "./Common";

import {
    HashRouter as Router,
    Route,
    Redirect,
} from 'react-router-dom';

import Passport from './Passport';
let passport = new Passport();

require('style/index.css');

export default class MyRouter extends React.Component {

    render() {
        return <Router>
            <switch>
                <Route exact path="/" render={(props) => {
                    if (passport.isLogin) {
                        return (
                            <Left
                                {...{
                                    username: passport.username,
                                    token: passport.token
                                }}
                            />
                        )
                    } else {
                        return <Redirect to="/login" />
                    }
                }}/>

                <Route path="/login" render={(props) => {
                    return (
                        <Login {...props} passport={passport} />
                    )
                }} />
            </switch>
        </Router>
    }
}