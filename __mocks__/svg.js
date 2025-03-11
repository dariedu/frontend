// export default 'SvgrURL'
// export const ReactComponent = 'div'

// import React from 'react';

// export default 'SvgrURL';
// const SvgrMock = React.forwardRef((props, ref) => <span ref={ref} {...props} />);

// export const ReactComponent = SvgrMock;

import React from 'react';
 
const SvgrMock = React.forwardRef((props, ref) => <span ref={ref} {...props} />);

export const ReactComponent = SvgrMock;
export default SvgrMock;