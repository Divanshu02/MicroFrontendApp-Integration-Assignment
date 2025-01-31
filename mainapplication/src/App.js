import React, { lazy, Suspense } from "react";

const ChatApp = lazy(() => import("chatapp/App"));
const EmailApp = lazy(() => import("emailapp/App"));
const App = () => {
  return (
    <>
      <h1 style={{textAlign:"center"}}>MAIN APPLICATION</h1>
      <Suspense fallback={<p>Loading Chat-APP...</p>}>
        <h1>VOICE CHAT APP--</h1>
        <ChatApp data="" />
      </Suspense>
      <Suspense fallback={<p>Loading Email-APP...</p>}>
        <h1>EMAIL APP----</h1>
        <EmailApp />
      </Suspense>
    </>
  );
};

export default App;
