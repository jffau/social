import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
// Redux stuff
import { connect } from 'react-redux';
import { createPost, getPosts } from '../redux/actions/dataActions';

const styles = theme => ({
  submitButton: {
    position: 'relative',
    marginTop: '30px'
  },
  progressSpinner: {
    position: 'absolute'
  },
  closeButton: {
    position: 'absolute',
    left: '90%',
    top: '10%'
  }
});

class CreatePost extends Component {
  state = {
    open: false,
    body: '',
    errors: {}
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: '' });
      this.handleClose();
    }
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false, errors: {} });
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.createPost({ body: this.state.body });
    this.props.getPosts();
  };
  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading }
    } = this.props;
    return (
      <>
        <MyButton onClick={this.handleOpen} tip="Create a new post">
          <AddIcon />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogTitle>Create a new post</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="body"
                type="text"
                label="Post body"
                multiline
                rows="3"
                placeholder="Your latest thoughts..."
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Submit
                {loading && (
                  <CircularProgress
                    size={30}
                    className={classes.progressSpinner}
                  />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

CreatePost.propTypes = {
  createPost: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI
});

export default connect(
  mapStateToProps,
  { createPost, getPosts }
)(withStyles(styles)(CreatePost));
