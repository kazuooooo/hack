import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tasks from '../components/Tasks'
import * as TasksActions from '../actions/tasks';

function mapStateToProps(state) {
  return {
    tasks: state.tasks
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(TasksActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
