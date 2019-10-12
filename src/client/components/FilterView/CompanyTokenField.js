// @flow
import React, { Component } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CloseIcon from '@material-ui/icons/Close';
import ListItemText from '@material-ui/core/ListItemText';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import Grid from 'react-virtualized/dist/commonjs/Grid';
import DeviceUnknownIcon from '@material-ui/icons/DeviceUnknown';
import CloseRounded from '@material-ui/icons/CloseRounded';
import RemoveAnimationProvider from '../RemoveAnimationProvider';
import type { Source, MaterialInputElement } from '~/reducer/dashboard';

type Props = {
  onChange: (value: string) => any,
  source: Source[],
  value: ?string,
  fullScreen: string,
};
// const theme = useTheme();
const flex = { display: 'flex' };
const contentStyle = { minHeight: 400, position: 'relative', display: 'flex', flexDirection: 'column' };
const rowStyle = { verticalAlign: 'middle', lineHeight: '50px', cursor: 'pointer' };
const containerStyle = { flex: '1 auto', 'overflowY': 'auto' };
const styles = (theme: any) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

@withStyles(styles)
class CompanyTokenField extends Component<Props> {
  state = { open: false, filter: '' };

  handleChange = (ev: Event) => {
    this.scrollToIndex = 0;
    this.setState({ scrollToIndex: 0, filter: ev.target.value })
    ;
  }

  onErase = () => {
    this.setState({ filter: '', scrollToIndex: 0 });
  }

  handleCancel = () => this.setState({ open: false });

  handleOpen = () => {
    if (!this.isLong) {
      return;
    }
    setTimeout(
      () => {
        this.forceUpdate();
        this.scrollerRef.forceUpdate();
      },
      500
    );
    this.setState({ open: true });
  }

  handleOk = (index: number) => {
    this.setState({ open: false });
    this.source.length && this.props.onChange(this.source[index].value);
  };

  rowRenderer = ({ columnIndex, key, rowIndex, style }: any) => {
    return (
      <ListItem
        key={key}
        onClick={() => this.handleOk(rowIndex)}
        style={{ ...rowStyle, ...style }}
      >
        <ListItemIcon>
          <DeviceUnknownIcon />
        </ListItemIcon>
        <ListItemText>
          {this.source[rowIndex].label}
        </ListItemText>
      </ListItem>
    );
  };

  render () {
    const { onChange, value, source, fullScreen, classes } = this.props;
    const { open, filter } = this.state;
    const val = filter.toLowerCase();
    this.source = val ? source.filter((x: Source) => x.label && !!~x.label.toLowerCase().indexOf(val)) : source;
    this.isLong = source.length > 2;

    if (!filter && !this.source.length) {
      return null;
    }

    return [
      <Select
        key='select'
        autoWidth
        open={this.isLong ? false : undefined}
        onOpen={this.handleOpen}
        style={flex}
        label={`Users (${source.length})`}
        onChange={({ target }: MaterialInputElement) => onChange(target.value)}
        value={value}
      >
        {source.map((x: Source) => (<MenuItem key={x.value} value={x.value}>{x.label}</MenuItem>))}
      </Select>,
      <Dialog
        key='dialog'
        // disableBackdropClick
        // disableEscapeKeyDown
        // onEntering={handleEntering}
        aria-labelledby='filter-dialog-title'
        aria-describedby='filter-dialog-description'
        open={open}
        fullWidth
        maxWidth='sm'
        fullScreen={fullScreen}
        onClose={this.handleCancel}
        scroll='paper'
      >
        <DialogTitle id='confirmation-dialog-title'>
          Company selector
          <IconButton aria-label='close' className={classes.closeButton} onClick={this.handleCancel}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          style={contentStyle}
        >
          <RemoveAnimationProvider>
            <FormControl>
              <InputLabel htmlFor='filter'>Company Filter</InputLabel>
              <Input
                id='filter'
                autoFocus
                fullWidth
                margin='dense'
                value={filter}
                onChange={this.handleChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={this.onErase}
                      onMouseDown={this.onErase}
                    >
                      <CloseRounded />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <div style={containerStyle} ref={(ref: any) => (this.contentRef = ref)}>
              <WindowScroller
                scrollElement={this.contentRef}
                ref={(ref: any) => (this.scrollerRef = ref)}
              >
                {({ isScrolling, registerChild, onChildScroll, scrollTop }: any) => (
                  <AutoSizer>
                    {({ width, height }: any) => (
                      <div ref={registerChild}>
                        <Grid
                          // autoWidth
                          autoContainerWidth
                          autoHeight
                          cellRenderer={this.rowRenderer}
                          columnWidth={500}
                          columnCount={1}
                          height={height}
                          overscanColumnCount={2}
                          overscanRowCount={2}
                          rowHeight={50}
                          rowCount={this.source.length}
                          scrollTop={scrollTop}
                          width={width}
                          isScrolling={isScrolling}
                          onScroll={onChildScroll}
                          filter={filter}
                          // scrollToIndex={scrollToIndex}
                        />
                      </div>
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            </div>
          </RemoveAnimationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>,
    ];
  }
}

export default CompanyTokenField;
