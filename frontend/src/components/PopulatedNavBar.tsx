import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import NavBar from "./nav/NavBar";
import NavDropdown from "./nav/NavDropdown";
import NavItem from "./nav/NavItem";

const PopulatedNavBar = () => {
  const [articlesDropdownOpen, setArticlesDropdownOpen] = useState(false);
  const [moderatorDropdownOpen, setModeratorDropdownOpen] = useState(false);

  const toggleArticlesDropdown = () => {
    setArticlesDropdownOpen(prev => !prev);
    setModeratorDropdownOpen(false); // Close the other dropdown if opened
  };

  const toggleModeratorDropdown = () => {
    setModeratorDropdownOpen(prev => !prev);
    setArticlesDropdownOpen(false); // Close the other dropdown if opened
  };

  return (
    <NavBar>
      <NavItem>SPEED</NavItem>
      <NavItem route="/" end>
        Home
      </NavItem>
      <NavItem dropdown route="/articles" onClick={toggleArticlesDropdown} aria-haspopup="true" aria-expanded={articlesDropdownOpen}>
        Articles <IoMdArrowDropdown />
        {articlesDropdownOpen && (
          <NavDropdown>
            <NavItem route="/articles">View articles</NavItem>
            <NavItem route="/articles/new">Submit new</NavItem>
          </NavDropdown>
        )}
      </NavItem>
      <NavItem dropdown route="/moderator" onClick={toggleModeratorDropdown} aria-haspopup="true" aria-expanded={moderatorDropdownOpen}>
        Moderator <IoMdArrowDropdown />
        {moderatorDropdownOpen && (
          <NavDropdown>
            <NavItem route="/moderator">Pending Articles</NavItem>
            <NavItem route="/moderator/rejected">Rejected Articles</NavItem>
          </NavDropdown>
        )}
      </NavItem>
    </NavBar>
  );
};

export default PopulatedNavBar;
