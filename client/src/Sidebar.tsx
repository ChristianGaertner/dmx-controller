import * as React from "react";
import cx from "classnames";
import { UiTab } from "./store/actions/setTab";
import { ConnectionIndicator } from "./ConnectionIndicator";

type Props = {
  tab: UiTab;
  setTab: (tab: UiTab) => void;
};

export const Sidebar: React.FunctionComponent<Props> = props => (
  <div className="flex flex-col bg-gray-1000 py-8 pr-4 border-l-4 border-blue-500 rounded-r-lg">
    <ul>
      <SidebarItem
        label="Live"
        active={props.tab === UiTab.LIVE}
        onClick={() => props.setTab(UiTab.LIVE)}
      />
      <SidebarItem
        label="Editor"
        active={props.tab === UiTab.PROGRAM}
        onClick={() => props.setTab(UiTab.PROGRAM)}
      />
      <SidebarItem
        label="Patch"
        active={props.tab === UiTab.PATCH}
        onClick={() => props.setTab(UiTab.PATCH)}
      />
    </ul>
    <div className="mt-auto">
      <ConnectionIndicator />
    </div>
  </div>
);

type SidebarItemProps = {
  label: string;
  active: boolean;
  onClick?: () => void;
};

const SidebarItem: React.FunctionComponent<SidebarItemProps> = ({
  label,
  active,
  onClick,
}) => (
  <li>
    <button
      onClick={onClick}
      className={cx(
        "py-2 px-4 my-2 rounded-r-full flex items-center text-white hover:bg-blue-800",
        {
          "bg-blue-900": active,
          "text-blue-200": active,
        },
      )}
    >
      {label === "Live" && (
        <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current mr-2">
          <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
            <g id="icon-shape">
              <path d="M11,11.7324356 C11.5978014,11.3866262 12,10.7402824 12,10 C12,8.8954305 11.1045695,8 10,8 C8.8954305,8 8,8.8954305 8,10 C8,10.7402824 8.40219863,11.3866262 9,11.7324356 L9,20 L11,20 L11,11.7324356 Z M14.2426407,14.2426407 C15.3284271,13.1568542 16,11.6568542 16,10 C16,6.6862915 13.3137085,4 10,4 C6.6862915,4 4,6.6862915 4,10 C4,11.6568542 4.67157288,13.1568542 5.75735931,14.2426407 L7.17157288,12.8284271 C6.44771525,12.1045695 6,11.1045695 6,10 C6,7.790861 7.790861,6 10,6 C12.209139,6 14,7.790861 14,10 C14,11.1045695 13.5522847,12.1045695 12.8284271,12.8284271 L14.2426407,14.2426407 L14.2426407,14.2426407 Z M17.0710678,17.0710678 C18.8807119,15.2614237 20,12.7614237 20,10 C20,4.4771525 15.5228475,0 10,0 C4.4771525,0 0,4.4771525 0,10 C0,12.7614237 1.11928813,15.2614237 2.92893219,17.0710678 L4.34314575,15.6568542 C2.8954305,14.209139 2,12.209139 2,10 C2,5.581722 5.581722,2 10,2 C14.418278,2 18,5.581722 18,10 C18,12.209139 17.1045695,14.209139 15.6568542,15.6568542 L17.0710678,17.0710678 Z" />
            </g>
          </g>
        </svg>
      )}
      {label === "Editor" && (
        <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current mr-2">
          <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
            <g id="icon-shape">
              <path d="M9,20 L18.0092049,20 C19.1017876,20 20,19.1054196 20,18.0018986 L20,13.9981014 C20,12.8867064 19.1086907,12 18.0092049,12 L15.0710678,12 L9.01026535,18.0608025 C9.00998975,18.139716 9.00652788,18.217877 9,18.2951708 L9,20 Z M9,16.6568542 L16.7344309,8.92242337 C17.5070036,8.14985069 17.5095717,6.88215473 16.7292646,6.10184761 L13.8981524,3.27073539 C13.1122774,2.48486045 11.8550305,2.48811526 11.0775766,3.26556912 L9,5.34314575 L9,16.6568542 Z M0,1.99079514 C0,0.891309342 0.886706352,0 1.99810135,0 L6.00189865,0 C7.10541955,0 8,0.898212381 8,1.99079514 L8,18.0092049 C8,19.1086907 7.11329365,20 6.00189865,20 L1.99810135,20 C0.894580447,20 0,19.1017876 0,18.0092049 L0,1.99079514 Z M4,17 C4.55228475,17 5,16.5522847 5,16 C5,15.4477153 4.55228475,15 4,15 C3.44771525,15 3,15.4477153 3,16 C3,16.5522847 3.44771525,17 4,17 Z" />
            </g>
          </g>
        </svg>
      )}
      {label === "Patch" && (
        <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current mr-2">
          <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
            <g id="icon-shape">
              <path d="M3.93830521,6.49683865 C3.63405147,7.02216933 3.39612833,7.5907092 3.23599205,8.19100199 L5.9747955e-16,9 L9.6487359e-16,11 L3.23599205,11.808998 C3.39612833,12.4092908 3.63405147,12.9778307 3.93830521,13.5031614 L2.22182541,16.363961 L3.63603897,17.7781746 L6.49683865,16.0616948 C7.02216933,16.3659485 7.5907092,16.6038717 8.19100199,16.7640079 L9,20 L11,20 L11.808998,16.7640079 C12.4092908,16.6038717 12.9778307,16.3659485 13.5031614,16.0616948 L16.363961,17.7781746 L17.7781746,16.363961 L16.0616948,13.5031614 C16.3659485,12.9778307 16.6038717,12.4092908 16.7640079,11.808998 L20,11 L20,9 L16.7640079,8.19100199 C16.6038717,7.5907092 16.3659485,7.02216933 16.0616948,6.49683865 L17.7781746,3.63603897 L16.363961,2.22182541 L13.5031614,3.93830521 C12.9778307,3.63405147 12.4092908,3.39612833 11.808998,3.23599205 L11,0 L9,0 L8.19100199,3.23599205 C7.5907092,3.39612833 7.02216933,3.63405147 6.49683865,3.93830521 L3.63603897,2.22182541 L2.22182541,3.63603897 L3.93830521,6.49683865 L3.93830521,6.49683865 Z M10,13 C11.6568542,13 13,11.6568542 13,10 C13,8.34314575 11.6568542,7 10,7 C8.34314575,7 7,8.34314575 7,10 C7,11.6568542 8.34314575,13 10,13 L10,13 Z" />
            </g>
          </g>
        </svg>
      )}
      {label}
    </button>
  </li>
);
