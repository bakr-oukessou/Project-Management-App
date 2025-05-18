import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const DirectorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1 className="header-title">Tableau de bord - Directeur</h1>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <div className="card-header">
                <h2 className="card-title">Gestion des Projets</h2>
              </div>
              <div className="card-content">
                <p className="card-description mb-4">
                  Gérez les projets, assignez les chefs de projet et suivez leur progression.
                </p>
                <Button 
                  className="btn-primary w-full"
                  onClick={() => navigate('/projects')}
                >
                  Voir les projets
                </Button>
              </div>
            </Card>

            <Card>
              <div className="card-header">
                <h2 className="card-title">Gestion des Équipes</h2>
              </div>
              <div className="card-content">
                <p className="card-description mb-4">
                  Consultez et gérez les équipes de développement et leurs membres.
                </p>
                <Button 
                  className="btn-primary w-full"
                  onClick={() => navigate('/teams')}
                >
                  Voir les équipes
                </Button>
              </div>
            </Card>

            <Card>
              <div className="card-header">
                <h2 className="card-title">Rapports</h2>
              </div>
              <div className="card-content">
                <p className="card-description mb-4">
                  Accédez aux rapports de performance et aux statistiques des projets.
                </p>
                <Button 
                  className="btn-primary w-full"
                  onClick={() => navigate('/reports')}
                >
                  Voir les rapports
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DirectorDashboard;
