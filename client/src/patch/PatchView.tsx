import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import {
  DevicePatch,
  getPatchedDevices,
  UniversePatch,
} from "../store/selectors";

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
      start: target.patch.address + target.numChannels,
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
          patch: { address: 513, universeId: 0 },
          deviceId: "",
          numChannels: 0,
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
    {props.target.patch.address !== props.startAddress &&
      Array.from(
        Array(props.target.patch.address - props.startAddress).keys(),
      ).map((_, i) => (
        <EmptyPosition key={i} address={props.startAddress + i} />
      ))}
    {props.target.numChannels > 0 && (
      <div
        className="border-blue-400 my-1 border p-1 h-12 hover:bg-blue-900 flex flex-col text-sm"
        style={{ width: `${props.target.numChannels * 50}px` }}
      >
        <span>{props.target.deviceId}</span>
        <span>{props.target.patch.address}</span>
      </div>
    )}
  </>
);

const EmptyPosition: React.FunctionComponent<{ address: number }> = ({
  address,
}) => (
  <div
    className="border-blue-900 my-1 border p-1 h-12"
    style={{ width: "50px" }}
  >
    {address}
  </div>
);

export const PatchView = connect(
  (state: AppState): StateProps => ({
    patch: getPatchedDevices(state),
  }),
)(PatchViewComp);
