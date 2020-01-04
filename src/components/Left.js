import Middle from "./Middle";
import React from 'react';
import * as CONSTANT from './Common';
import {timeToDay} from './Common'

import 'babel-polyfill';
import {inSenvenDays} from "./Common";

require('style/index.css');

var superagent = require('superagent');

function sortDownDate(a, b) {
    return Date.parse(a.ddl_time) - Date.parse(b.ddl_time);
}

export default class Left extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            todoTags: [],  //只要字段名
            todosData: [],
            viewType: 'all',
            token: this.props.token
        };

        this.changeViewType = this.changeViewType.bind(this);
        this.getAllTag = this.getAllTag.bind(this);
        this.getAllTask = this.getAllTask.bind(this);
        // this.addTodo = this.addTodo.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.updateIllegal = this.updateIllegal.bind(this);
        this.getLegalTasks = this.getLegalTasks.bind(this);
        this.onRef = this.onRef.bind(this);

        this.getAllTag(this.state.token);
        // this.getAllTask(this.state.token);
        this.getLegalTasks(this.state.token);


    }

    changeViewType(type){
        this.click(true);
        this.getAllTask(this.state.token);
        this.setState({
            viewType: type
        });
    }

    async getLegalTasks(token) {
        await this.updateIllegal(token);
        await this.getAllTask(token);
    }

    async updateIllegal(token) {
        try {
            let res = await superagent
                .get("http://aliyun.nihil.top:10999/api/task/update/state/expired?SecretKey=kdK4AnNlLm")
                .set('token', token);

            return res;
        } catch (err) {
            alert(err);
            alert('任务列表拉取失败！');
            return -1;
        }

    }

    // TODO：获取标签及标签下的tasks
    async getAllTag(token) {
        let that = this;
        superagent
            .get('http://aliyun.nihil.top:10999/api/task/tag/list?SecretKey=kdK4AnNlLm')
            .set('token', token)
            .end(function(err, res) {
                if (err) {
                    alert('err');
                } else {
                    let json = JSON.parse(res.text);

                    let tags = json['data']['tags'];

                    tags = tags.filter(tag=> {
                        return tag !== '' && tag !== 'default'
                    });
                    that.setState({
                        todoTags: tags
                    });
                }
            });
    }

    async getAllTask(token) {
        try {
            let res = await superagent
                .get('http://aliyun.nihil.top:10999/api/task/list?SecretKey=kdK4AnNlLm&o=asc&op=ddl_time&rn=100')
                .set('token', token);

            let json = JSON.parse(res.text);

            let items = json['data'];
            items = items.map(item=> {
                let todo = {};
                todo.id = item['id'];
                todo.title = item['title'];
                todo.content = item['content'];
                todo.state = item['state'];
                todo.tag = item['tag'];
                todo.priority = item['priority'];
                todo.done_time = timeToDay(item['done_time']);
                todo.ddl_time = timeToDay(item['ddl_time']);
                return todo
            });
            this.setState({
                todosData: items
            });
            return 0;
        } catch(err) {
            alert(err);
            alert('任务列表拉取失败！');
            return -1;
        }
    }

    // addTodo(task) {
    //     let {todosData} = this.state;
    //     todosData.push(task);
    //     this.setState({
    //         todosData: todosData
    //     })
    // }

    async updatePage() {
        await this.getAllTag(this.state.token);
        await this.updateIllegal(this.state.token);
        await this.getAllTask(this.state.token);
    }

    onRef(ref){
        this.child = ref;
    }

    click(trueOrFalse) {
        this.child.click(trueOrFalse);
    }

    render() {

        let state = this.state;
        let tasks = null;

        switch(state.viewType) {
            case 'today':
                tasks = state.todosData.filter(task=> {
                    let date = new Date();
                    date.setTime(date.getTime());
                    let today = date.getFullYear()+"/" + (date.getMonth() < 9 ? ('0' + (date.getMonth()+1)) : (date.getMonth() + 1)) + "/" + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());
                    return today === task['ddl_time'] &&
                        (task['state'] === CONSTANT.EXPIRED_NOT_DELETED || task['state'] === CONSTANT.ACTIVE_NOT_DELETED || task['state'] === CONSTANT.DONE_NOT_DELETED)
                });
                break;
            case 'seven':
                tasks = state.todosData.filter(task=> {
                    return inSenvenDays(task['ddl_time']) &&
                        (task['state'] === CONSTANT.EXPIRED_NOT_DELETED || task['state'] === CONSTANT.ACTIVE_NOT_DELETED || task['state'] === CONSTANT.DONE_NOT_DELETED)
                });
                break;
            case 'done':
                tasks = state.todosData.filter(task=> {
                    return task['state'] === CONSTANT.DONE_NOT_DELETED
                });
                break;
            case 'deleted':
                tasks = state.todosData.filter(task=> {
                    return task['state'] === CONSTANT.ACTIVE_OR_EXPIRED_DELETED || task['state'] === CONSTANT.DONE_DELETED
                });
                break;
            case 'all':
                tasks = state.todosData.filter(task=> {
                    return task['state'] === CONSTANT.EXPIRED_NOT_DELETED || task['state'] === CONSTANT.ACTIVE_NOT_DELETED || task['state'] === CONSTANT.DONE_NOT_DELETED
                });
                break;
            default:
                tasks = state.todosData.filter(task=> {
                    return task['tag'] === state.viewType &&
                        (task['state'] === CONSTANT.EXPIRED_NOT_DELETED || task['state'] === CONSTANT.ACTIVE_NOT_DELETED || task['state'] === CONSTANT.DONE_NOT_DELETED)
                })
        }

        // 标签
        let todoTags = state.todoTags;
        todoTags = todoTags.map(tag=> {
            return(
                <li className={state.viewType===tag?'active':'inactive'}><a href="#" onClick={()=>this.changeViewType(tag)}><span className="sidebar-inline-icon glyphicon glyphicon-heart-empty"></span>{tag}</a></li>
            )
        });

        let tagsBox = (
            <section>
                <div style={{"border-bottom": "1px solid #a9a9a9", "margin": "20px 40px 10px 40px"}}><h5 style={{"text-align": "center", "color": "#696969"}}>清单</h5></div>
                <ul className="nav nav-sidebar">
                    {todoTags}
                </ul>
            </section>
        );

        return (
            <div style={{"height": "100%"}}>
                <div className="row" style={{"height": "100%"}}>
                    <div className="col-md-2 sidebar" style={{"height": "100%", 'border-right':'1px solid #d3d3d3', "background": "rgba(230,230,250,0.3)"}}>
                        <div className="username">
                            <label><h3>{'🎅  ' + this.props.username}</h3></label>
                        </div>
                        <div className="divider"/>
                        <div className="project-view">
                            <section>
                                <div className="smart-view">
                                    <ul className="nav nav-sidebar">
                                        <li className={this.state.viewType==='today'?'active':'inactive'}><a href="#" onClick={()=>this.changeViewType('today')}><span className="sidebar-inline-icon glyphicon glyphicon glyphicon-thumbs-up"></span>今日</a></li>
                                        <li className={this.state.viewType==='seven'?'active':'inactive'}><a href="#" onClick={()=>this.changeViewType('seven')}><span className="sidebar-inline-icon glyphicon glyphicon-briefcase"></span>最近7天</a></li>
                                        <li className={this.state.viewType==='all'?'active':'inactive'}><a href="#" onClick={()=>this.changeViewType('all')}><span className="sidebar-inline-icon glyphicon glyphicon-folder-open"></span>收集箱</a></li>
                                    </ul>
                                </div>
                            </section>
                            <section>
                                <ul className="nav nav-sidebar">
                                    <li className={this.state.viewType==='done'?'active':'inactive'}><a href="#" onClick={()=>this.changeViewType('done')}><span className="sidebar-inline-icon glyphicon glyphicon-ok-circle"></span>已完成</a></li>
                                    <li className={this.state.viewType==='deleted'?'active':'inactive'}><a href="#" onClick={()=>this.changeViewType('deleted')}><span className="sidebar-inline-icon glyphicon glyphicon-remove-sign"></span>垃圾桶</a></li>
                                </ul>
                            </section>
                            <div className="divider"/>
                            {tagsBox}
                        </div>
                    </div>
                    <Middle
                        {...{
                            onRef: this.onRef,
                            updatePage: this.updatePage,
                            tags: state.todoTags,
                            tasks: tasks,
                            token: state.token,
                            viewType: state.viewType
                        }}
                    />
                </div>
            </div>
        )
    }
}




