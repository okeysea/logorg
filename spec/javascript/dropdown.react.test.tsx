import * as React from 'react'
import * as renderer from 'react-test-renderer'
import ReactTestUtils from 'react-dom/test-utils'
import Dropdown from '../../app/javascript/components/Dropdown'
import { shallow, mount, render } from 'enzyme'

describe('<Dropdown />', ()=>{

  it('Dropdown component snapshot test', ()=>{
    const component = renderer.create(
        <Dropdown>
          <Dropdown.Trigger>
            <b>trigger button</b>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item>item 1</Dropdown.Item>
            <Dropdown.Item>item 2</Dropdown.Item>
            <Dropdown.Item>item 3</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>item 4</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it('Dropdown component with href attribute snapshot test', ()=>{
    const component = renderer.create(
        <Dropdown>
          <Dropdown.Trigger>
            <b>trigger button</b>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item>item 1</Dropdown.Item>
            <Dropdown.Item>item 2</Dropdown.Item>
            <Dropdown.Item>item 3</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>item 4</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
