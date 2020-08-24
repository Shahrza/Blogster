import React, { useEffect } from 'react';
import Suggestions from './Suggestions';
import EditorsPick from './EditorsPick';
import Blogs from './Blogs';
import axios from 'axios';

export default function Home() {
  useEffect(() => {
    axios(`${process.env.API_URL}/api/v1/blog`).then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div>
      <Suggestions />
      <EditorsPick />
      <Blogs />
    </div>
  );
}
