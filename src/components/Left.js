import Middle from "./Middle";
import React from 'react';
import * as CONSTANT from './Common';
import {timeToDay} from './Common'

import 'babel-polyfill';

require('style/index.css');

var superagent = require('superagent');

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

        this.getAllTag(this.state.token);
        // this.getAllTask(this.state.token);
        this.getLegalTasks(this.state.token);
    }

    changeViewType(type){
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
                .get('http://aliyun.nihil.top:10999/api/task/list?SecretKey=kdK4AnNlLm&rn=100')
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

    render() {

        let state = this.state;
        let tasks = null;

        switch(state.viewType) {
            case 'today':
                tasks = state.todosData.filter(task=> {
                    let date = new Date();
                    let today = date.toLocaleDateString();
                    return today === task['ddl_time'] &&
                        (task['state'] === CONSTANT.EXPIRED_NOT_DELETED || task['state'] === CONSTANT.ACTIVE_NOT_DELETED)
                });
                break;
            case 'seven':
                tasks = state.todosData.filter(task=> {
                    let date = new Date();
                    let today = date.toLocaleDateString();
                    return today === task['ddl_time'] &&
                        (task['state'] === CONSTANT.EXPIRED_NOT_DELETED || task['state'] === CONSTANT.ACTIVE_NOT_DELETED)
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
                    return task['state'] === CONSTANT.EXPIRED_NOT_DELETED || task['state'] === CONSTANT.ACTIVE_NOT_DELETED
                });
                break;
            default:
                tasks = state.todosData.filter(task=> {
                    return task['tag'] === state.viewType &&
                        (task['state'] === CONSTANT.EXPIRED_NOT_DELETED || task['state'] === CONSTANT.ACTIVE_NOT_DELETED)
                })
        }

        // 标签
        let todoTags = state.todoTags;
        todoTags = todoTags.map(tag=> {
            return(
                <li className={state.viewType===tag?'active':''}><a href="#" onClick={()=>this.changeViewType(tag)}>{tag}</a></li>
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
                    <div className="col-md-2 sidebar" style={{"height": "100%", "background": "rgba(f5,f5,f5,0.9)"}}>
                        <div className="tool-bar">
                            <label><h3>{'🍎 ' + this.props.username}</h3></label>
                        </div>
                        <div className="project-view">
                            <section>
                                <div className="smart-view">
                                    <ul className="nav nav-sidebar">
                                        <li className={this.state.viewType==='today'?'active':''}><a href="#" onClick={()=>this.changeViewType('today')}>今日</a></li>
                                        <li className={this.state.viewType==='seven'?'active':''}><a href="#" onClick={()=>this.changeViewType('seven')}>最近7天</a></li>
                                        <li className={this.state.viewType==='all'?'active':''}><a href="#" onClick={()=>this.changeViewType('all')}>收集箱</a></li>
                                    </ul>
                                </div>
                            </section>
                            <section>
                                <ul className="nav nav-sidebar">
                                    <li className={this.state.viewType==='done'?'active':''}><a href="#" onClick={()=>this.changeViewType('done')}>已完成</a></li>
                                    <li className={this.state.viewType==='deleted'?'active':''}><a href="#" onClick={()=>this.changeViewType('deleted')}>垃圾桶</a></li>
                                </ul>
                            </section>
                            <div className="divider"/>
                            {tagsBox}
                        </div>
                    </div>
                    <Middle
                        {...{
                            updatePage: this.updatePage,
                            tags: state.todoTags,
                            tasks: tasks,
                            token: state.token,
                            viewType: state.viewType,
                        }}
                    />
                </div>
            </div>
        )
    }
}




