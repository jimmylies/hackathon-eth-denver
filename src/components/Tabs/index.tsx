import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.scss';

export interface TabProps {
  tabs: string[];
  onClick?: any;
  links?: string[];
  vertical?: boolean;
}

const Tabs = ({ tabs, onClick }: TabProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className='Tabs'>
      {tabs.map((tab, i) => (
        <button
          className={`tab ${i === activeTab ? 'activeTab' : ''}`}
          key={i}
          onClick={() => {
            if (onClick) onClick(i);
            setActiveTab(i);
          }}
        >
          <div>{tab}</div>
        </button>
      ))}
    </div>
  );
};
export default Tabs;
