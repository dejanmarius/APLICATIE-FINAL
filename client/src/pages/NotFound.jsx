import React from "react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <section className="page_404">
      <div className="container1">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center ">404</h1>
              </div>

              
                <h1 className="h1">Look like you're lost</h1>

                <p>We couldn't find this page.</p>

                <a href="/" className="link_404">
                  Go to Home
                </a>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
