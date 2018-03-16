/**
 * Created by vilson on 2017/5/16.
 */
import {sendAjax} from '../assets/js/utils'
import axios from 'axios'

const getProjectList =  (filter) => {
    // axios.get('/public/?service=ProjectMember.getProjectListByMember',{data:filter})
    sendAjax({
        url: 'ProjectMember.getProjectListByMember',
        data:filter,
        success: function (res) {
            return res.data.content
        }
    });
}

export {getProjectList}