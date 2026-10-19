import { useState } from 'react';
import { CatalogPage } from './components/CatalogPage';
import { DetailPage } from './components/DetailPage';
import { SubmitPage } from './components/SubmitPage';
import { CollectionsPage, CollectionDetail, IndustriesPage } from './components/CollectionsPage';

export default function App() {
  const [page, setPage] = useState('home');
  const [solutionId, setSolutionId] = useState('fraud-shield');
  const [collectionId, setCollectionId] = useState('bfsi-starter');
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [layout] = useState('list');
  const [cardStyle] = useState('editorial');

  const scrollTop = () => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.cat-scroll').forEach(el => { el.scrollTop = 0; });
    });
  };

  const goTo = (next, opts = {}) => {
    setHistory(h => [...h, { page, solutionId, collectionId }]);
    if (opts.solutionId) setSolutionId(opts.solutionId);
    if (opts.collectionId) setCollectionId(opts.collectionId);
    setPage(next);
    scrollTop();
  };

  const goNav = (target) => {
    setHistory([]);
    setPage(target);
    scrollTop();
  };

  const goBack = () => {
    setHistory(h => {
      if (h.length === 0) { setPage('home'); return h; }
      const prev = h[h.length - 1];
      setPage(prev.page);
      if (prev.solutionId) setSolutionId(prev.solutionId);
      if (prev.collectionId) setCollectionId(prev.collectionId);
      return h.slice(0, -1);
    });
    scrollTop();
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const onOpenSubmit = () => goTo('submit');

  let content;
  if (page === 'detail') {
    content = (
      <DetailPage
        solutionId={solutionId}
        onBack={goBack}
        onOpenSolution={(id) => goTo('detail', { solutionId: id })}
        onNav={goNav}
        onSubmit={onOpenSubmit}
      />
    );
  } else if (page === 'submit') {
    content = (
      <SubmitPage
        onCancel={goBack}
        onComplete={() => {
          setHistory([]);
          setPage('home');
          scrollTop();
          showToast('Submission received — practice lead will review within 3 business days.');
        }}
        onNav={goNav}
        onSubmit={onOpenSubmit}
      />
    );
  } else if (page === 'collections') {
    content = (
      <CollectionsPage
        onOpenSolution={(id) => goTo('detail', { solutionId: id })}
        onOpenSubmit={onOpenSubmit}
        onNav={goNav}
        onOpenCollection={(id) => goTo('collection', { collectionId: id })}
      />
    );
  } else if (page === 'collection') {
    content = (
      <CollectionDetail
        collectionId={collectionId}
        onBack={goBack}
        onOpenSolution={(id) => goTo('detail', { solutionId: id })}
        onOpenSubmit={onOpenSubmit}
        onNav={goNav}
      />
    );
  } else if (page === 'industries') {
    content = (
      <IndustriesPage
        onOpenSolution={(id) => goTo('detail', { solutionId: id })}
        onOpenSubmit={onOpenSubmit}
        onNav={goNav}
      />
    );
  } else {
    content = (
      <CatalogPage
        layout={layout}
        cardStyle={cardStyle}
        mode={page === 'catalog' ? 'catalog' : 'home'}
        onOpenSolution={(id) => goTo('detail', { solutionId: id })}
        onOpenSubmit={onOpenSubmit}
        onNav={goNav}
      />
    );
  }

  return (
    <>
      {content}
      {toast && <div className="sp-toast">✓ {toast}</div>}
    </>
  );
}
