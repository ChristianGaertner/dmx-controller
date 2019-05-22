import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { getDeviceIds } from "../../store/selectors";

type OwnProps = {
  deviceIds: string[];
  onChange: (deviceIds: string[]) => void;
};

type StateProps = {
  allDeviceIds: string[];
};

type Props = OwnProps & StateProps;

const DeviceSelectorComp: React.FunctionComponent<Props> = props => (
  <div className="p-4 flex">
    {props.allDeviceIds.map(id => (
      <div
        key={id}
        className="flex flex-col items-center mx-2 p-2 bg-gray-800 rounded"
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
        <span>{id}</span>
      </div>
    ))}
  </div>
);

const mapStateToProps = (state: AppState): StateProps => ({
  allDeviceIds: getDeviceIds(state),
});

export const DeviceSelector = connect(mapStateToProps)(DeviceSelectorComp);
