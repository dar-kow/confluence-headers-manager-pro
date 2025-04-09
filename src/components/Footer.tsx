import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <div className="footer">
            <div className="author-signature">
                Coded by <a
                    href="https://github.com/dar-kow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="author-link"
                >darkow</a> :)<br />
                Powered by React
            </div>
        </div>
    );
};

export default Footer;