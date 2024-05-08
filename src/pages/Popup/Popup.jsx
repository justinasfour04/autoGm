import React from 'react';
import './Popup.scss';

const Popup = () => {
  return (
    <main className="h-screen w-screen border-[0.3rem] border-white bg-[#020202]">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="form__group">
          <input
            className="form__field"
            type="text"
            name="message"
            placeholder="Message"
            required
          />
          <label htmlFor="message" className="form__label">
            Message
          </label>
        </div>
      </div>
    </main>
  );
};

export default Popup;
