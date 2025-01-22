import { ReactElement } from "react";


function Search({ value, onChange, children }:{value:string, onChange:(event: any) => void, children:ReactElement|string }) {
  return (
    <div>
      <label htmlFor="search">{children}</label>
      <input
        id="search"
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Search;