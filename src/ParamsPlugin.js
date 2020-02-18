import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import reducers, { namespace } from './states';
import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import styled from "@emotion/styled";

const PLUGIN_NAME = 'ParamsPlugin';

function HotelRoute(props) {

  console.log('Hotel Route', props);

  const { location } = props.route;

  const matches = location.pathname
    .split('/')
    .slice(1, -1);
  const room_number = matches[1];
  const path = matches[0];
  console.log('path', path);
  return props.render({path, room_number: room_number});
}

const HotelMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
    h3 {
      font-weight: 600;
      font-size: 1.3em;
      font-family: sans;
    }
`;

class Hotel extends React.Component {

  render() {
    console.log('props', this.props);
    const { roomNumber, path } = this.props;

    if (roomNumber && path) {

      return (
        <HotelMessage>
          <h3>Thank you for visiting the { path } </h3>
          <div> Your Room number is: {roomNumber} </div>
        </HotelMessage>
      );
    }
    return (
      <div>
        <p>Room number not available</p>
      </div>
    );
  }
}

export default class ParamsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    const options = { sortOrder: -1 };

    flex.AgentDesktopView
      .Panel1
      .Content
      .add(
        <CustomTaskListContainer
          key="custom-task-list"
          manager={manager}
          flex={flex}
        />,
        options
      );


    flex.ViewCollection
      .Content
      .add(
        <flex.View
          name={'hotel'}
          key={'hotel-view'}
          route={{ path: '/hotel' }}
        >
          <HotelRoute
            path={'/hotel/:room_number'}
            name={'hotel'}
            render={({path, room_number}) => {
              console.log('match', path, room_number);
              return (
                <Hotel
                  path={path}
                  roomNumber={room_number}
                />
              );
            }}
          />
        </flex.View>
      )
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }
    manager.store.addReducer(namespace, reducers);
  }
}
