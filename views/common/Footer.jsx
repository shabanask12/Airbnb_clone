import React from 'react';

const Footer = () => {
  return (
    <footer style={{
        borderTop: '1px solid #ebebeb',
        padding: '20px 40px',
        backgroundColor: '#f7f7f7',
        marginTop: 'auto', // helps it stick to bottom
        textAlign: 'center',
        fontSize: '14px',
        color: '#222'
    }}>
      <p>© 2026 Airbnb Clone. No rights reserved - this is a demo!</p>
    </footer>
  );
};

export default Footer;