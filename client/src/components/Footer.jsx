import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { footerLinks } from "../utils/data";
import { Link } from "react-router-dom";
import "animate.css";
import { useSelector } from "react-redux";
import logo from "../assets/logo.jpg";

const Footer = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <footer className="text-white animate__animated animate__fadeIn">
      
      <div className="bg-[#282773]">
        <div className="container px-5 py-10 mx-auto"> {/* Reduced padding */}
          <div className="w-full flex flex-wrap gap-5 justify-between -mb-10 -px-4">
            <div className="w-auto px-4"> {/* New section for the quote */}
              <img src={logo} width={70} height={70} alt="Job Seek" className="mb-4" />
              <p>We transform the way candidates find jobs and companies hire talent.</p>
              <p>&copy; 2024 Job Journey, Inc.</p>
            </div>
            {user?.token &&
              footerLinks.map(({ id, title, links }) => (
                <div className="w-auto px-4" key={id + title}>
                  <h2 className="font-medium text-white tracking-widest text-sm mb-2"> {/* Reduced margin */}
                    {title}
                  </h2>
                  <div className="mb-6 flex flex-col gap-1"> {/* Reduced margin and gap */}
                    {links.map((link, index) => (
                      <Link
                        key={link + index}
                        className="text-gray-300 text-sm hover:text-white"
                      >
                        {link}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[#282773]">
          

          <div className="container mx-auto px-5 py-4 flex justify-center"> {/* Added social media icons */}
            <a
              target="_blank"
              href="https://github.com/yousaf44malik"
              className="text-white text-xl mx-2 hover:scale-125 ease-in-out duration-300 cursor-pointer"
            >
              <FaFacebookF />
            </a>
            <a
              target="_blank"
              href="https://instagram.com/yousaf_488/"
              className="text-white text-xl mx-2 hover:scale-125 ease-in-out duration-300 cursor-pointer"
            >
              <FiInstagram />
            </a>
            <a
              target="_blank"
              href="https://www.linkedin.com/in/yousaf-malik-769b3b244/"
              className="text-white text-xl mx-2 hover:scale-125 ease-in-out duration-300 cursor-pointer"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
