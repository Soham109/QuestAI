import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useAuth } from "../components/AuthProvider";
import Spline from '@splinetool/react-spline';
import './style.css';

const Home = () => {
  const { currentUser } = useAuth();
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const inventoryRef = collection(db, "users", currentUser.uid, "inventory");
    const q = query(inventoryRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setInventory(items);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <main className="spline-container">
      <Spline
        scene="https://prod.spline.design/W4nXNJ-GpaUMvHQn/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      </main>
  );
};

export default Home;