import React from "react";

function Footer() {
  return (
    <div className="flex mx-28 pt-5 pb-16 justify-between text-gray-400 border-t border-gray-200">
      <div>
        <h3 className="font-semibold">Contact</h3>
        <p className="text-sm">Email: contact@fublog.com</p>
        <p className="text-sm">Phone: (+84) 123 456 789</p>
      </div>
      <div>
        <h3 className="font-semibold">© Copyright 2017 - 2023</h3>
        <p className="text-sm">TP. Thủ Đức, TP. Hồ Chí Minh</p>
        <p className="text-sm">Phone: (+84) 123 456 789</p>
      </div>
    </div>
  );
}

export default Footer;
