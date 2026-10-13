import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Spinner } from '@openedx/paragon';
import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';

interface VoteAggregate {
  scale_text: string;
  count: number;
}

interface Answer {
  username: string;
  user_vote: string;
  user_freeform: string;
}

interface FeedbackBlock {
  display_name: string;
  prompts: Record<string, any>;
  vote_aggregate: VoteAggregate[];
  answers: Answer[];
  unit_display_name: string;
  subsection_display_name: string;
  section_display_name: string;
  average_rating: number;
  url: string;
}

const PlaceholderSlot = (_props: Record<string, any>) => null;

const FeedbackTab = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<FeedbackBlock[]>([]);

  const isFrench = typeof langIsFrench === 'function' ? langIsFrench() : false;

  const t = {
    title: isFrench ? 'Rétroaction sur le cours' : 'Course Feedback',
    component: isFrench ? 'Composante' : 'Component',
    ratingsCount: isFrench ? "Nombre d'évaluations" : 'Number of ratings',
    averageRating: isFrench ? 'Note moyenne' : 'Average rating',
    comments: isFrench ? 'Commentaires' : 'Feedback / Comments',
    noRatings: isFrench ? 'Aucune évaluation' : 'No ratings',
    noComments: isFrench ? 'Aucun commentaire' : 'No comments',
    noBlocks: isFrench
      ? 'Aucune composante de rétroaction trouvée dans ce cours.'
      : 'No feedback components found in this course.',
    loadError: isFrench
      ? 'Erreur lors du chargement de la rétroaction.'
      : 'Failed to load course feedback.',
  };

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const { lmsBaseUrl } = getSiteConfig();
    const endpoint = `${lmsBaseUrl || ''}/api/feedback/v1/courses/${courseId}/`;

    getAuthenticatedHttpClient()
      .get<{ course_id: string; blocks: FeedbackBlock[] }>(endpoint)
      .then((res) => {
        setBlocks(res.data?.blocks || []);
        setLoading(false);
      })
      .catch((err) => {
        const errorMsg =
          err?.response?.data?.error ||
          err?.message ||
          t.loadError;
        setError(errorMsg);
        setLoading(false);
      });
  }, [courseId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div className="my-4">
        <Alert variant="info">{t.noBlocks}</Alert>
      </div>
    );
  }

  const colComponentStyle = { width: '30%' };
  const colRatingsStyle = { width: '25%' };
  const colAverageStyle = { width: '15%' };
  const colCommentsStyle = { width: '30%' };

  return (
    <div className="feedback-instructor-wrapper my-4">
      <h3 className="mb-4">{t.title}</h3>
      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th scope="col" style={colComponentStyle}>{t.component}</th>
              <th scope="col" style={colRatingsStyle}>{t.ratingsCount}</th>
              <th scope="col" style={colAverageStyle}>{t.averageRating}</th>
              <th scope="col" style={colCommentsStyle}>{t.comments}</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block, idx) => (
              <tr key={idx}>
                <td>
                  <a
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fw-bold"
                  >
                    {[
                      block.section_display_name,
                      block.subsection_display_name,
                      block.unit_display_name,
                      block.display_name,
                    ]
                      .filter(Boolean)
                      .join(' > ')}
                  </a>
                </td>
                <td>
                  {block.vote_aggregate && block.vote_aggregate.length > 0 ? (
                    <ul className="list-unstyled mb-0">
                      {block.vote_aggregate.map((vote, vIdx) => (
                        <li key={vIdx}>
                          <span className="fw-semibold">{vote.scale_text}:</span> {vote.count}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted">{t.noRatings}</span>
                  )}
                </td>
                <td>
                  <span className="badge bg-primary fs-6">
                    {block.average_rating}
                  </span>
                </td>
                <td>
                  {block.answers && block.answers.length > 0 ? (
                    <ul className="list-unstyled mb-0">
                      {block.answers.map((ans, aIdx) => (
                        <li key={aIdx} className="mb-2 pb-2 border-bottom">
                          <span className="badge bg-secondary me-2">
                            {ans.user_vote}
                          </span>
                          <span>{ans.user_freeform}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted">{t.noComments}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
