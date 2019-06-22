import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { getDeviceIds } from "../../store/patch/selectors";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { Device } from "../Device";

const CheckableDevice: React.FunctionComponent<
  { id: string; divProps?: Object } & Props
> = ({ id, divProps, ...props }) => (
  <div
    key={id}
    className="flex flex-col items-center mx-2 p-2 bg-gray-800 rounded"
    {...divProps}
  >
    <span>
      <input
        type="checkbox"
        checked={props.deviceIds.includes(id)}
        onChange={e => {
          if (e.target.checked) {
            props.onChange([...props.deviceIds, id]);
          } else {
            props.onChange(props.deviceIds.filter(oldId => oldId !== id));
          }
        }}
      />
    </span>
    <Device id={id} />
  </div>
);

const DeviceDraggable: React.FunctionComponent<
  { id: string; index: number } & Props
> = ({ id, index, ...props }) => (
  <Draggable draggableId={id} index={index}>
    {(dragProvided: DraggableProvided) => (
      <CheckableDevice
        id={id}
        divProps={{
          ref: dragProvided.innerRef,
          ...dragProvided.draggableProps,
          ...dragProvided.dragHandleProps,
        }}
        {...props}
      />
    )}
  </Draggable>
);

type OwnProps = {
  deviceIds: string[];
  onChange: (deviceIds: string[]) => void;
};

type StateProps = {
  allDeviceIds: string[];
};

type Props = OwnProps & StateProps;

const DeviceSelectorComp: React.FunctionComponent<Props> = props => {
  const { deviceIds, onChange } = props;

  const onDragEnd = React.useCallback(
    ({ destination, draggableId }: DropResult) => {
      if (!destination) {
        return;
      }

      const target = destination.index;

      const newDeviceIds = deviceIds.filter(id => id !== draggableId);

      newDeviceIds.splice(target, 0, draggableId);

      onChange(newDeviceIds);
    },
    [deviceIds, onChange],
  );

  const inactiveDeviceIds = props.allDeviceIds.filter(
    id => !deviceIds.includes(id),
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-4 flex flex-col">
        <Droppable droppableId="DEVICES" direction="horizontal">
          {(dropProvided: DroppableProvided) => (
            <div className="flex" ref={dropProvided.innerRef}>
              {deviceIds.map((id, index) => (
                <DeviceDraggable key={id} id={id} index={index} {...props} />
              ))}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="flex mt-2">
          {inactiveDeviceIds.map(id => (
            <CheckableDevice key={id} id={id} {...props} />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  allDeviceIds: getDeviceIds(state),
});

export const DeviceSelector = connect(mapStateToProps)(DeviceSelectorComp);
