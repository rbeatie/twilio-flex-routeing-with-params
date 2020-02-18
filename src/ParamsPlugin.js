import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import reducers, { namespace } from './states';
import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import styled from "@emotion/styled";

const PLUGIN_NAME = 'ParamsPlugin';

/**
 * Workaround for path matching with react-router takes a path and returns the paths in it's render props.
 * @param props
 * @returns {*}
 * @constructor
 */
function PathRoute(props) {

  const { location } = props.route;

  // workaround - splits the route
  const noSlashPath = location.pathname[location.pathname.length - 1] === '/'
    ? location.pathname.slice(1, -1)
    : location.pathname;
  const paths = noSlashPath
    .replace(/:/, '')
    .split('/');

  return props.render({paths});
}

// Demo Component

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
    const  { paths } = this.props;

    if (paths) {
      return (
        <HotelMessage>
          <h3>Thank you for visiting the { paths[0] } </h3>
          <div> Your Room number is: { paths[1] } </div>
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

// end / demo component

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

    // Example of using dynamic path values

    flex.ViewCollection
      .Content
      .add(
        <flex.View
          name={'hotel'}
          key={'hotel-view'}
          route={{ path: '/hotel' }}
        >
          <PathRoute
            path={'/hotel/:room_number'}
            name={'hotel'}
            render={({paths}) => {
              return (
                <Hotel
                  paths={paths}
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
