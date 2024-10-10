import PropTypes from "prop-types";

const BackdropSidebar = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
    onClick={onClick}></div>
);

// Prop validation
BackdropSidebar.propTypes = {
  onClick: PropTypes.func.isRequired, // Validate that onClick is a function and is required
};

const BackdropAvatar = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black opacity-50 sm:opacity-0 z-10 "
    onClick={onClick}></div>
);

// Prop validation
BackdropAvatar.propTypes = {
  onClick: PropTypes.func.isRequired, // Validate that onClick is a function and is required
};

export { BackdropAvatar, BackdropSidebar };
