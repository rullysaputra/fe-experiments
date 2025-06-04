export type CSSPropertiesWithVars = React.CSSProperties & {
  "--item-length": number;
};

export type ServerToClientEvents = {
  items_update: (data: { items: [] }) => void;
  item_update: (item: object) => void;
  get_inventory_detail: (data: object) => void;
};

export type ClientToServerEvents = {
  place_bid: (data: object) => void;
  initial_inventory_detail: (data: object) => void;
};
