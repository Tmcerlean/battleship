import React from 'react';
import Header from './Header';
import Footer from './Footer';

// -----------------------------------------------
//
// Desc: Reusable Layout for all pages
//
// -----------------------------------------------

const Layout = (props) => {

    return (
        <>
            <Header />
                <main>{props.children}</main>
            <Footer />
        </>
    );
}

export default Layout;