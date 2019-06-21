import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import {
  DevicePatch,
  getPatchedDevices,
  UniversePatch,
} from "../store/patch/selectors";

type StateProps = {
  patch: UniversePatch;
};

const PatchViewComp: React.FunctionComponent<StateProps> = props => {
  return (
    <div className="flex flex-col p-4">
      {Object.entries(props.patch).map(([universeId, patch]) => (
        <React.Fragment key={universeId}>
          <h2>Universe {universeId}</h2>
          <UniversePatchView key={universeId} patch={patch} />
        </React.Fragment>
      ))}
    </div>
  );
};

const UniversePatchView: React.FunctionComponent<{ patch: DevicePatch[] }> = ({
  patch,
}) => {
  const patched = patch.reduce(
    ({ comp, start }, target) => ({
      comp: (
        <>
          {comp}
          <PatchSection startAddress={start} target={target} />
        </>
      ),
      start: target.startAddress + target.numChannels,
    }),
    {
      comp: <></>,
      start: 1,
    },
  );

  return (
    <div className="flex flex-wrap content-start">
      {patched.comp}
      <PatchSection
        startAddress={patched.start}
        target={{
          startAddress: 513,
          deviceId: "",
          numChannels: 0,
          name: "",
        }}
      />
    </div>
  );
};

const PatchSection: React.FunctionComponent<{
  startAddress: number;
  target: DevicePatch;
}> = props => (
  <>
    {props.target.startAddress !== props.startAddress &&
      Array.from(
        Array(props.target.startAddress - props.startAddress).keys(),
      ).map((_, i) => (
        <EmptyPosition key={i} address={props.startAddress + i} />
      ))}
    {props.target.numChannels > 0 && (
      <div
        className="border-blue-400 my-1 border p-1 h-12 hover:bg-blue-900 flex flex-col text-sm overflow-hidden"
        style={{ width: `${props.target.numChannels * 50}px` }}
      >
        <div className="flex justify-between flex-shrink-0">
          <span>{props.target.startAddress}</span>
          <span>
            {props.target.startAddress + props.target.numChannels - 1}
          </span>
        </div>
        <span>{props.target.name}</span>
      </div>
    )}
  </>
);

const EmptyPosition: React.FunctionComponent<{ address: number }> = ({
  address,
}) => (
  <div
    className="border-blue-900 my-1 border p-1 h-12 text-sm"
    style={{ width: "50px" }}
  >
    <div className="flex">
      <span>{address}</span>
    </div>
  </div>
);

export const PatchView = connect(
  (state: AppState): StateProps => ({
    patch: getPatchedDevices(state),
  }),
)(PatchViewComp);
